"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MapPin,
  Target,
  ArrowRight,
  Compass,
  Users,
  Search,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { LocationArea } from "@/types";
import { openBookingModalGlobal } from "@/context/BookingModalContext";
import "leaflet/dist/leaflet.css";

interface ServiceLocationsMapProps {
  locations: LocationArea[];
}

const MANCHESTER_CENTER: [number, number] = [53.4808, -2.2426];
const DEFAULT_ZOOM = 11;

export function ServiceLocationsMap({ locations }: ServiceLocationsMapProps) {
  // Only display active locations with coordinates
  const activeLocations = useMemo(() => {
    return locations
      .filter((loc) => loc.isActive !== false && loc.latitude && loc.longitude)
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }, [locations]);

  const [selectedId, setSelectedId] = useState<string | null>(
    activeLocations[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);

  // Filter locations by search query (name, postcodes, test center)
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return activeLocations;
    const q = searchQuery.toLowerCase().trim();
    return activeLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.testCenterName.toLowerCase().includes(q) ||
        loc.postcodes.some((pc) => pc.toLowerCase().includes(q)) ||
        (loc.description && loc.description.toLowerCase().includes(q))
    );
  }, [activeLocations, searchQuery]);

  // Detect theme (dark or light)
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    updateTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Safe initialization preventing mobile scroll lock
      const map = L.map(mapContainerRef.current, {
        center: MANCHESTER_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: false, // Prevents accidental scroll trapping on desktop & mobile
        touchZoom: false, // Prevents mobile pinch-zoom from trapping vertical page swipe
        zoomControl: false, // We'll add custom positioned zoom control
        dragging: true,
      });

      mapInstanceRef.current = map;

      // Add zoom control at bottom right
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      // Determine initial tile layer
      const isDark = document.documentElement.classList.contains("dark");
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      const tileLayer = L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Create Custom SVG Markers for each active location
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markers: Record<string, any> = {};

      activeLocations.forEach((loc) => {
        if (loc.latitude && loc.longitude) {
          const customHtml = `
            <div class="nextdrive-marker-pin group" data-loc-id="${loc.id}">
              <div class="nextdrive-pulse-ring"></div>
              <div class="nextdrive-marker-body">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.7 2 12.2v3.8c0 .6.4 1 1 1h2"/>
                  <circle cx="7" cy="17" r="2"/>
                  <path d="M9 17h6"/>
                  <circle cx="17" cy="17" r="2"/>
                </svg>
              </div>
              <div class="nextdrive-marker-label">
                ${loc.name.split("&")[0].trim()}
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            className: "nextdrive-leaflet-div-icon",
            html: customHtml,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            popupAnchor: [0, -22],
          });

          const popupContent = document.createElement("div");
          popupContent.className = "nextdrive-map-popup";
          popupContent.innerHTML = `
            <div class="p-4 max-w-[280px]">
              <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">
                <span>📍 DVSA Test Zone</span>
              </div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white leading-tight">${loc.name}</h4>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">${loc.coverageText || "Intensive driving lessons & DVSA test prep"}</p>
              
              <div class="my-3 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                <span class="font-medium text-slate-700 dark:text-slate-300">🎯 ${loc.testCenterName}</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">${loc.activeInstructors} ADIs</span>
              </div>

              <div class="flex flex-wrap gap-1 mb-3">
                ${loc.postcodes.slice(0, 5).map((pc) => `<span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200/70 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200">${pc}</span>`).join("")}
              </div>

              <button
                type="button"
                id="btn-book-${loc.id}"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>Book Lesson in ${loc.name.split(" ")[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          `;

          const marker = L.marker([loc.latitude, loc.longitude], {
            icon: customIcon,
            title: loc.name,
          })
            .addTo(map)
            .bindPopup(popupContent, {
              className: "nextdrive-custom-leaflet-popup",
              maxWidth: 320,
              minWidth: 260,
              closeButton: true,
            });

          marker.on("click", () => {
            setSelectedId(loc.id);
          });

          marker.on("popupopen", () => {
            const btn = document.getElementById(`btn-book-${loc.id}`);
            if (btn) {
              btn.onclick = () => {
                openBookingModalGlobal({
                  area: loc.name,
                  source: "map-marker-popup",
                });
              };
            }
          });

          markers[loc.id] = marker;
        }
      });

      markersRef.current = markers;
      setMapLoaded(true);

      // Force render resize after load
      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 300);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeLocations]);

  // Update Tile Layer when Theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrl = isDarkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    tileLayerRef.current.setUrl(tileUrl);
  }, [isDarkMode]);

  // Fly to location when selected
  const handleSelectLocation = (loc: LocationArea) => {
    setSelectedId(loc.id);

    if (mapInstanceRef.current && loc.latitude && loc.longitude) {
      mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 13, {
        duration: 1.2,
      });

      const marker = markersRef.current[loc.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1250);
      }
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(MANCHESTER_CENTER, DEFAULT_ZOOM, {
        duration: 1,
      });
      mapInstanceRef.current.closePopup();
    }
  };

  return (
    <div className="w-full">
      {/* Top Interactive Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Manchester Coverage
            </span>
            <span className="text-xs text-muted-foreground">
              {activeLocations.length} Primary Test Zones Active
            </span>
          </div>
        </div>

        {/* Search input for postcodes & areas */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search postcode (M1, SK8) or area..."
            className="w-full rounded-xl border border-border bg-card/80 backdrop-blur-xs pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Split Grid: 60% Map Canvas | 40% Interactive Area Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAP CONTAINER (7 cols on lg screens = ~58%) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
          <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[580px] rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
            {/* Map Canvas */}
            <div
              ref={mapContainerRef}
              className="w-full h-full z-10"
              style={{ minHeight: "100%" }}
            />

            {!mapLoaded && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-card/80 backdrop-blur-xs">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Initializing Manchester Map Canvas...
                </span>
              </div>
            )}

            {/* Mobile Scroll Safety Notice Banner */}
            <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 pointer-events-none">
              <div className="inline-flex items-center gap-2 rounded-xl bg-card/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 border border-border text-[11px] font-medium text-foreground shadow-xs pointer-events-auto">
                <Compass className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Tap any marker to view test center &amp; instructors</span>
              </div>
            </div>

            {/* Reset View Button */}
            <button
              onClick={handleResetView}
              className="absolute top-3 right-3 z-20 rounded-xl bg-card/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 border border-border text-foreground hover:text-primary transition shadow-xs"
              title="Reset Manchester Overview"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Active Test Center Floating Card Overlay */}
            {selectedId && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs z-20 pointer-events-auto">
                {(() => {
                  const currentLoc = activeLocations.find((l) => l.id === selectedId);
                  if (!currentLoc) return null;
                  return (
                    <div className="rounded-2xl border border-border bg-card/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl text-card-foreground">
                      <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1">
                        <span className="flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5" />
                          {currentLoc.testCenterName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {currentLoc.activeInstructors} ADIs
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">
                        {currentLoc.name}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {currentLoc.postcodes.slice(0, 4).map((pc) => (
                          <span
                            key={pc}
                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground border border-border/60"
                          >
                            {pc}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          openBookingModalGlobal({
                            area: currentLoc.name,
                            source: "map-floating-overlay",
                          })
                        }
                        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3 py-2 text-xs font-bold text-primary-foreground transition shadow-xs"
                      >
                        <span>Book in {currentLoc.name.split(" ")[0]}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* AREA CARDS LIST (5 cols on lg screens = ~42%) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Driving Hub ({filteredLocations.length})
            </span>
            <span className="text-[11px] text-primary font-medium">
              Click to center map
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredLocations.map((loc) => {
              const isSelected = selectedId === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all text-card-foreground group ${
                    isSelected
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-1 ring-primary"
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted/40 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors border ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-surface-secondary text-primary border-border group-hover:bg-primary/10"
                        }`}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {loc.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="font-medium text-foreground flex items-center gap-1">
                            🎯 {loc.testCenterName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                      <Users className="w-2.5 h-2.5" />
                      {loc.activeInstructors} Instructors
                    </span>
                  </div>

                  {loc.description && (
                    <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>
                  )}

                  {/* Postcodes chips */}
                  <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                    <div className="flex flex-wrap gap-1">
                      {loc.postcodes.slice(0, 4).map((pc) => (
                        <span
                          key={pc}
                          className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground border border-border/60"
                        >
                          {pc}
                        </span>
                      ))}
                      {loc.postcodes.length > 4 && (
                        <span className="text-[10px] font-mono text-muted-foreground px-1 self-center">
                          +{loc.postcodes.length - 4}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBookingModalGlobal({
                          area: loc.name,
                          source: "location-card-button",
                        });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover transition shrink-0"
                    >
                      <span>Book Lessons</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredLocations.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-foreground">
                  No matching service areas found
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Try searching for &quot;M1&quot;, &quot;Didsbury&quot;, or &quot;Sale&quot;
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs font-bold text-primary hover:underline"
                >
                  Reset search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS for Custom Leaflet Markers and Dark/Light Popups */}
      <style jsx global>{`
        .nextdrive-leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }

        .nextdrive-marker-pin {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          cursor: pointer;
        }

        .nextdrive-pulse-ring {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          background-color: rgba(79, 70, 229, 0.45);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .dark .nextdrive-pulse-ring {
          background-color: rgba(6, 182, 212, 0.5);
        }

        .nextdrive-marker-body {
          position: relative;
          z-index: 10;
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
          border: 2px solid #ffffff;
          transition: transform 0.2s ease;
        }

        .dark .nextdrive-marker-body {
          border: 2px solid #0f172a;
          box-shadow: 0 4px 14px rgba(6, 182, 212, 0.5);
        }

        .nextdrive-marker-pin:hover .nextdrive-marker-body {
          transform: scale(1.18);
        }

        .nextdrive-marker-label {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Custom Leaflet Popup Styling */
        .nextdrive-custom-leaflet-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 1.25rem;
          background-color: #ffffff;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .dark .nextdrive-custom-leaflet-popup .leaflet-popup-content-wrapper {
          background-color: #0f172a;
          border-color: #1e293b;
          color: #f8fafc;
        }

        .nextdrive-custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          line-height: normal;
        }

        .nextdrive-custom-leaflet-popup .leaflet-popup-tip {
          background: #ffffff;
        }

        .dark .nextdrive-custom-leaflet-popup .leaflet-popup-tip {
          background: #0f172a;
        }

        .nextdrive-custom-leaflet-popup .leaflet-popup-close-button {
          top: 10px !important;
          right: 10px !important;
          color: #94a3b8 !important;
          padding: 4px !important;
        }

        .nextdrive-custom-leaflet-popup .leaflet-popup-close-button:hover {
          color: #0f172a !important;
        }

        .dark .nextdrive-custom-leaflet-popup .leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
