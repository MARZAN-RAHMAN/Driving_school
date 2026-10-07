"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, ImagePlus, Trash2, AlertCircle } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { ProfilePhotoCropModal } from "./ProfilePhotoCropModal";

interface UserProfilePhotoUploadProps {
  currentAvatar?: string | null;
  userName?: string;
  onChange: (avatarUrl: string) => void;
  onRemove?: () => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UserProfilePhotoUpload({
  currentAvatar,
  userName = "User",
  onChange,
  onRemove,
}: UserProfilePhotoUploadProps) {
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (selectedFileUrl && selectedFileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(selectedFileUrl);
      }
    };
  }, [selectedFileUrl]);

  const handleFile = (file: File) => {
    setErrorMessage(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("Image must be smaller than 5MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFileUrl(objectUrl);
    setIsCropOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (e.target) e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Display with Camera Overlay */}
        <div className="relative group shrink-0">
          <UserAvatar
            src={currentAvatar}
            name={userName}
            size="2xl"
            className="rounded-full shadow-lg"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
            aria-label="Upload new profile photo"
            title="Upload photo"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Upload Controls & Guidelines */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Profile Picture</h4>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP • Square 1:1 ratio • Maximum 5MB.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition cursor-pointer"
            >
              <ImagePlus className="h-3.5 w-3.5 text-primary" />
              Choose Photo
            </button>

            {currentAvatar && onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/15 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
          isDraggingOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/40"
        }`}
      >
        <ImagePlus className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-xs font-medium text-foreground">
          Drag and drop your image here, or{" "}
          <span className="text-primary font-semibold underline underline-offset-2">
            browse from files
          </span>
        </p>
        <span className="text-[11px] text-muted-foreground mt-0.5">
          You can crop, zoom, and center your face after selecting.
        </span>
      </div>

      {/* Crop / Reposition Modal */}
      {selectedFileUrl && (
        <ProfilePhotoCropModal
          isOpen={isCropOpen}
          imageSrc={selectedFileUrl}
          onClose={() => {
            setIsCropOpen(false);
            setSelectedFileUrl(null);
          }}
          onSave={(newUrl) => {
            onChange(newUrl);
            setIsCropOpen(false);
            setSelectedFileUrl(null);
          }}
        />
      )}
    </div>
  );
}
