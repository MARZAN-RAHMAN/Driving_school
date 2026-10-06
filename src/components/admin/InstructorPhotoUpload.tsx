/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ImagePlus,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  Trash2,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Move,
} from "lucide-react";
import { getInstructorInitials } from "@/components/instructor/InstructorImage";

interface InstructorPhotoUploadProps {
  currentAvatar?: string;
  avatarPositionX?: number;
  avatarPositionY?: number;
  avatarZoom?: number;
  instructorName?: string;
  badgeNumber?: string;
  onChange: (data: {
    avatar: string;
    avatarPositionX: number;
    avatarPositionY: number;
    avatarZoom: number;
  }) => void;
  onRemove?: () => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function InstructorPhotoUpload({
  currentAvatar = "",
  avatarPositionX = 50,
  avatarPositionY = 20,
  avatarZoom = 1,
  instructorName = "Instructor Name",
  badgeNumber = "ADI-XXXXX",
  onChange,
  onRemove,
}: InstructorPhotoUploadProps) {
  // File & Crop state
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Crop manipulation state
  const [zoom, setZoom] = useState(avatarZoom || 1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // offset in pixels
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);

  // Clean up object URLs when unmounting
  useEffect(() => {
    return () => {
      if (selectedFileUrl && selectedFileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(selectedFileUrl);
      }
    };
  }, [selectedFileUrl]);

  // File selection validation
  const handleFile = useCallback((file: File) => {
    setErrorMessage(null);

    // 1. Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Please upload a JPG, PNG or WebP image.");
      return;
    }

    // 2. Validate Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("Image must be smaller than 5MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFileUrl(objectUrl);

    // Reset pan & zoom to smart initial composition
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsCropOpen(true);
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (e.target) e.target.value = "";
  };

  // Drag and Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const onDragLeave = () => {
    setIsDraggingOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch pan support for mobile/tablets
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

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(3, Math.max(1, +(prev + delta).toFixed(2))));
  };

  // Reset framing
  const handleResetFraming = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Render crop to canvas and upload
  const handleApplyCrop = async () => {
    const img = cropImageRef.current;
    const container = cropContainerRef.current;
    if (!img || !container) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // Create high-res 4:5 target canvas (800 x 1000)
      const targetWidth = 800;
      const targetHeight = 1000;
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Canvas context initialization failed");

      // Container viewport dimensions (CSS pixels)
      const containerRect = container.getBoundingClientRect();
      const cWidth = containerRect.width;
      const cHeight = containerRect.height;

      // Base scaling of the image when object-fit: cover is simulated
      const scaleToCover = Math.max(cWidth / img.naturalWidth, cHeight / img.naturalHeight);
      const displayedWidth = img.naturalWidth * scaleToCover * zoom;
      const displayedHeight = img.naturalHeight * scaleToCover * zoom;

      // Offset from center
      const imageLeft = (cWidth - displayedWidth) / 2 + pan.x;
      const imageTop = (cHeight - displayedHeight) / 2 + pan.y;

      // Map from container coordinates (cWidth, cHeight) to canvas coordinates (targetWidth, targetHeight)
      const scaleRatioX = targetWidth / cWidth;
      const scaleRatioY = targetHeight / cHeight;

      const drawX = imageLeft * scaleRatioX;
      const drawY = imageTop * scaleRatioY;
      const drawW = displayedWidth * scaleRatioX;
      const drawH = displayedHeight * scaleRatioY;

      // Fill neutral background in case edges show
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw cropped and positioned image
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Convert canvas to Blob (WebP or JPEG)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.92);
      });

      if (!blob) throw new Error("Failed to process image blob");

      // Upload to server
      const formData = new FormData();
      formData.append("file", blob, `instructor_crop_${Date.now()}.webp`);

      const uploadRes = await fetch("/api/admin/instructors/upload", {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      if (!uploadRes.ok || !data.success) {
        throw new Error(data.error || "Unable to upload the image. Please try again.");
      }

      // Calculate focal percentage for responsive rendering
      const focalX = Math.round(50 - (pan.x / cWidth) * 50);
      const focalY = Math.round(25 - (pan.y / cHeight) * 50);

      const boundedX = Math.max(0, Math.min(100, focalX));
      const boundedY = Math.max(0, Math.min(100, focalY));

      // Notify parent of updated avatar
      onChange({
        avatar: data.url,
        avatarPositionX: boundedX,
        avatarPositionY: boundedY,
        avatarZoom: zoom,
      });

      setIsCropOpen(false);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to upload the image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Re-open crop editor for current avatar
  const handleReposition = () => {
    if (currentAvatar) {
      setSelectedFileUrl(currentAvatar);
      setZoom(avatarZoom || 1);
      setPan({ x: 0, y: 0 });
      setIsCropOpen(true);
    }
  };

  // Remove photo
  const handleConfirmRemove = () => {
    setShowDeleteConfirm(false);
    setSelectedFileUrl(null);
    if (onRemove) {
      onRemove();
    } else {
      onChange({
        avatar: "",
        avatarPositionX: 50,
        avatarPositionY: 20,
        avatarZoom: 1,
      });
    }
  };

  const initials = getInstructorInitials(instructorName);
  const hasPhoto = Boolean(currentAvatar);

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileInputChange}
        className="hidden"
        aria-label="Upload instructor profile photo"
      />

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-500 hover:text-rose-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. UPLOAD AREA OR ACTIVE PHOTO CONTAINER */}
      {!hasPhoto ? (
        /* Empty State: Drag & Drop Zone */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload instructor photo. Drag and drop or click to browse. Max 5MB."
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isDraggingOver
              ? "border-indigo-600 bg-indigo-50/60 dark:border-indigo-400 dark:bg-indigo-950/40 scale-[1.01]"
              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/80"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 shadow-xs transition group-hover:scale-105">
            <ImagePlus className="h-6 w-6" />
          </div>

          <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
            Upload Instructor Photo
          </h4>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Drag &amp; drop portrait photo or click to browse
          </p>

          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-200/60 dark:bg-slate-800 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            JPG, PNG or WebP &bull; Max 5MB &bull; 4:5 Portrait Recommended
          </span>
        </div>
      ) : (
        /* Photo Active State: Dual Live Previews (Profile Avatar & Fleet Card) */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-indigo-500" />
              Live Framing Previews (Public &amp; Fleet)
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              4:5 Portrait Frame Applied
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Live Preview 1: PROFILE PHOTO / ROUND AVATAR */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="relative shrink-0">
                <img
                  src={currentAvatar}
                  alt={instructorName}
                  style={{
                    objectFit: "cover",
                    objectPosition: `${avatarPositionX}% ${avatarPositionY}%`,
                  }}
                  className="h-16 w-16 rounded-full ring-2 ring-indigo-500/30 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Profile Avatar
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {instructorName}
                </p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {badgeNumber}
                </span>
              </div>
            </div>

            {/* Live Preview 2: FLEET CARD MINI PREVIEW */}
            <div className="relative aspect-[4/5] max-w-[150px] mx-auto sm:mx-0 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs group">
              <img
                src={currentAvatar}
                alt={instructorName}
                style={{
                  objectFit: "cover",
                  objectPosition: `${avatarPositionX}% ${avatarPositionY}%`,
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-semibold">
                  <ShieldCheck className="w-2.5 h-2.5 text-indigo-400" />
                  Grade A
                </span>
                <p className="mt-1 text-[11px] font-bold truncate leading-tight">
                  {instructorName}
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition"
                aria-label="Change profile photo"
              >
                <ImagePlus className="h-3.5 w-3.5 text-slate-500" />
                Change Photo
              </button>

              <button
                type="button"
                onClick={handleReposition}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 shadow-xs transition"
                aria-label="Reposition image framing"
              >
                <Sliders className="h-3.5 w-3.5 text-indigo-500" />
                Reposition
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              aria-label="Remove profile photo"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* 2. REMOVE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Remove Profile Photo?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A professional initials avatar ({initials}) will be used instead.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs"
              >
                Yes, Remove Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE CROP & FRAMING EDITOR MODAL */}
      {isCropOpen && selectedFileUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative flex w-full max-w-lg flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Adjust Instructor Profile Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCropOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close photo editor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Crop Viewport */}
            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Drag to center face and shoulders. Use the zoom slider to ensure natural headroom.
              </p>

              {/* Locked 4:5 Ratio Portrait Viewport */}
              <div className="relative mx-auto w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border-2 border-indigo-500 shadow-lg select-none">
                <div
                  ref={cropContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onWheel={handleWheel}
                  className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
                >
                  <img
                    ref={cropImageRef}
                    src={selectedFileUrl}
                    alt="Crop preview"
                    draggable={false}
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: "center center",
                      transition: isPanning ? "none" : "transform 0.1s ease-out",
                    }}
                    className="max-w-none pointer-events-none select-none w-full h-full object-cover"
                  />

                  {/* Rule of Thirds / Headroom Guidelines */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                    <div className="border-r border-b border-white/15" />
                    <div className="border-r border-b border-white/15 relative">
                      {/* Top third guideline indicator for eye/head level */}
                      <span className="absolute bottom-1 inset-x-0 text-center text-[9px] font-mono text-white/50 tracking-widest uppercase">
                        Head / Eyes
                      </span>
                    </div>
                    <div className="border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-b border-white/15" />
                    <div className="border-r border-white/15" />
                    <div className="border-r border-white/15" />
                    <div />
                  </div>
                </div>

                {/* Subtle Helper Overlay */}
                <div className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white/90 flex items-center gap-1 pointer-events-none">
                  <Move className="h-3 w-3" />
                  Drag to frame
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="space-y-1.5 max-w-sm mx-auto">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="h-3.5 w-3.5 text-slate-400" />
                    Zoom Level
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>

                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                    aria-label="Adjust zoom slider"
                  />

                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-850/50">
              <button
                type="button"
                onClick={handleResetFraming}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                aria-label="Reset image position"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Frame
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCropOpen(false)}
                  disabled={isUploading}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition active:scale-[0.98] disabled:opacity-50"
                  aria-label="Apply crop and upload photo"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Apply Crop</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
