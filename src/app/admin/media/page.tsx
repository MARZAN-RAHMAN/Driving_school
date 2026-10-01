/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

export default function AdminMediaPage() {
  const mediaItems = [
    {
      title: "2025 VW Golf Dual Controls",
      type: "Vehicle",
      dimensions: "1920x1080",
      size: "840 KB",
      url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&fit=crop",
    },
    {
      title: "Hannah Adams Pass Certificate",
      type: "Test Pass",
      dimensions: "1080x1080",
      size: "620 KB",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&fit=crop",
    },
    {
      title: "Ford Fiesta EcoBoost Dual Control",
      type: "Vehicle",
      dimensions: "1920x1080",
      size: "910 KB",
      url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&fit=crop",
    },
    {
      title: "Cockpit Drill Controls Infographic",
      type: "Instructional",
      dimensions: "1200x800",
      size: "450 KB",
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&fit=crop",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs font-medium text-slate-400 hover:text-slate-600 transition dark:text-slate-500 dark:hover:text-slate-300"
            >
              Control Center
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Media</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Media Library & Assets
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Vehicle fleet photos, instructor portraits, pass certificates and instructional assets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600">
            <Upload className="h-3.5 w-3.5" />
            Upload Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {mediaItems.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs group dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={item.url}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                {item.type}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5 dark:text-white">
                {item.title}
              </h4>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono dark:text-slate-500">
                <span>{item.dimensions}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
