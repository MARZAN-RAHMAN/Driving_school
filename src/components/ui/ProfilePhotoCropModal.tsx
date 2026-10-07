/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  Loader2,
  Move,
  AlertCircle,
} from "lucide-react";

interface ProfilePhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onSave: (url: string) => void;
}

export function ProfilePhotoCropModal({
  isOpen,
  imageSrc,
  onClose,
  onSave,
}: ProfilePhotoCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [prevImageSrc, setPrevImageSrc] = useState(imageSrc);
  if (imageSrc !== prevImageSrc) {
    setPrevImageSrc(imageSrc);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setErrorMessage(null);
  }

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isPanning, dragStart]
  );

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Process canvas and upload
  const handleApplyCrop = async () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // 1:1 Square Target Canvas (800 x 800)
      const targetSize = 800;
      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not initialize canvas graphics context.");

      const containerRect = container.getBoundingClientRect();
      const cWidth = containerRect.width;
      const cHeight = containerRect.height;

      // Scale to cover the container
      const scaleToCover = Math.max(cWidth / img.naturalWidth, cHeight / img.naturalHeight);
      const displayedWidth = img.naturalWidth * scaleToCover * zoom;
      const displayedHeight = img.naturalHeight * scaleToCover * zoom;

      // Offset from center
      const imageLeft = (cWidth - displayedWidth) / 2 + pan.x;
      const imageTop = (cHeight - displayedHeight) / 2 + pan.y;

      // Map from container coordinates to 800x800 canvas
      const scaleRatioX = targetSize / cWidth;
      const scaleRatioY = targetSize / cHeight;

      const drawX = imageLeft * scaleRatioX;
      const drawY = imageTop * scaleRatioY;
      const drawW = displayedWidth * scaleRatioX;
      const drawH = displayedHeight * scaleRatioY;

      // Fill neutral dark background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, targetSize, targetSize);

      // Draw positioned image
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Convert to WebP blob (quality 0.92)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.92);
      });

      if (!blob) throw new Error("Image processing failed.");

      // Upload via unified avatar endpoint
      const formData = new FormData();
      formData.append("file", blob, `avatar_${Date.now()}.webp`);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload cropped photo.");
      }

      // Broadcast update event so header and account menus reflect new avatar immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("nextdrive:user-updated", {
            detail: { avatar: data.url },
          })
        );
      }

      onSave(data.url);
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save cropped image.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl text-card-foreground">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 id="crop-modal-title" className="text-base font-bold text-foreground">
              Adjust Profile Picture
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag to reposition and use the slider to zoom your photo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            aria-label="Close photo editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Crop Viewport & Live Circular Preview */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* Main 1:1 Interactive Viewport */}
          <div className="sm:col-span-2">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-2 border-dashed border-border bg-slate-950 select-none ${
                isPanning ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              {/* Background Image being panned/zoomed */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Upload preview"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isPanning ? "none" : "transform 0.1s ease-out",
                }}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />

              {/* Circular Overlay Mask Guideline */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[90%] w-[90%] rounded-full border-2 border-primary shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]" />
              </div>

              {/* Pan Hint Overlay */}
              <div className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-xs shadow-xs">
                <Move className="h-3 w-3" />
                <span>Drag to align</span>
              </div>
            </div>
          </div>

          {/* Side Circular Avatar Preview */}
          <div className="flex flex-col items-center justify-center space-y-3 sm:border-l sm:border-border sm:pl-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Live Preview
            </span>
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-primary ring-offset-2 ring-offset-card shadow-md bg-slate-900">
              <img
                src={imageSrc}
                alt="Circular preview"
                style={{
                  transform: `translate(${pan.x * (96 / 280)}px, ${pan.y * (96 / 280)}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <span className="text-[10px] text-muted-foreground text-center">
              Circular Avatar
            </span>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="mt-5 space-y-3 rounded-2xl bg-muted/40 p-4 border border-border">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <ZoomIn className="h-3.5 w-3.5 text-primary" />
              Zoom Level
            </span>
            <span className="font-mono text-muted-foreground">{zoom.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-border accent-primary"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="min-h-[40px] rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isUploading}
            className="min-h-[40px] inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Photo...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Apply &amp; Save Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
