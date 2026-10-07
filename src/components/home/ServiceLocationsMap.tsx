"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { LocationArea } from "@/types";
import { openBookingModalGlobal } from "@/context/BookingModalContext";

interface ServiceLocationsMapProps {
  locations: LocationArea[];
}

const MANCHESTER_CENTER = { lat: 53.4808, lng: -2.2426 };
const DEFAULT_ZOOM = 11;

// Automotive futuristic dark theme for Google Maps JS API
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#171c26" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#171c26" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b9bb4" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c5d1e6" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8b9bb4" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#111721" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#546e7a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#252d3d" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1b212d" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#313c52" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1b212d" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e2433" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c111a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
];

// Clean modern darkish slate theme for Light Mode
const LIGHT_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#dce3ed" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#243346" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#edf2f8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#edf2f8" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#b0c1d5" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#c7d4e5" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#9bb0c7" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8c9dc" }] },
];

export function ServiceLocationsMap({ locations }: ServiceLocationsMapProps) {
  // Only display active database-driven locations with coordinates
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
  const [mapLoaded, setMapLoaded] = useState(
    () => !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );
  const [jsApiActive, setJsApiActive] = useState(false);

  // Dynamic coordinates for interactive view
  const [viewCenter, setViewCenter] = useState(MANCHESTER_CENTER);
  const [viewZoom, setViewZoom] = useState(DEFAULT_ZOOM);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Record<string, any>>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

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

  // Update Map Styles when Theme changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({
        styles: isDarkMode ? DARK_MAP_STYLES : LIGHT_MAP_STYLES,
      });
    }
  }, [isDarkMode]);

  // Fly to / Select location handler
  const handleSelectLocation = useCallback(
    (loc: LocationArea) => {
      setSelectedId(loc.id);

      if (loc.latitude && loc.longitude) {
        setViewCenter({ lat: loc.latitude, lng: loc.longitude });
        setViewZoom(13);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo({
            lat: loc.latitude,
            lng: loc.longitude,
          });
          mapInstanceRef.current.setZoom(13);

          const marker = markersRef.current[loc.id];
          if (marker && infoWindowRef.current) {
            const popupHtml = `
              <div class="nextdrive-google-popup-content">
                <div class="popup-eyebrow">DVSA Test Zone</div>
                <h4 class="popup-title">${loc.name}</h4>
                <p class="popup-desc">${loc.coverageText || "Intensive driving lessons & DVSA test prep"}</p>
                
                <div class="popup-badge-row">
                  <span class="popup-badge-testcenter">🎯 ${loc.testCenterName}</span>
                  <span class="popup-badge-instructors">${loc.activeInstructors} ADIs</span>
                </div>

                <div class="popup-postcodes-row">
                  ${loc.postcodes.slice(0, 4).map((pc) => `<span class="popup-postcode-chip">${pc}</span>`).join("")}
                </div>

                <button
                  type="button"
                  id="btn-gmap-book-${loc.id}"
                  class="popup-book-btn"
                >
                  <span>Book Lessons in ${loc.name.split(" ")[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            `;

            infoWindowRef.current.setContent(popupHtml);
            infoWindowRef.current.open({
              anchor: marker,
              map: mapInstanceRef.current,
            });

            // Attach click listener for popup book button
            setTimeout(() => {
              const btn = document.getElementById(`btn-gmap-book-${loc.id}`);
              if (btn) {
                btn.onclick = () => {
                  openBookingModalGlobal({
                    area: loc.name,
                    source: "google-maps-infowindow",
                  });
                };
              }
            }, 100);
          }
        }
      }
    },
    []
  );

  // Initialize Google Maps JavaScript API if API Key is configured
  useEffect(() => {
    let isMounted = true;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      // Without API key, the component uses the interactive Google Maps embed + live pins overlay
      return;
    }

    async function initGoogleMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        // Load Maps & Marker Libraries
        const { Map, InfoWindow } = await importLibrary("maps");
        const { AdvancedMarkerElement } = await importLibrary("marker");

        if (!isMounted || !mapContainerRef.current) return;

        const isDark = document.documentElement.classList.contains("dark");

        // Initialize Google Map
        const map = new Map(mapContainerRef.current, {
          center: MANCHESTER_CENTER,
          zoom: DEFAULT_ZOOM,
          gestureHandling: "cooperative",
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          styles: isDark ? DARK_MAP_STYLES : LIGHT_MAP_STYLES,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID",
        });

        mapInstanceRef.current = map;

        const infoWindow = new InfoWindow({
          maxWidth: 320,
          minWidth: 260,
        });
        infoWindowRef.current = infoWindow;

        // Render markers for all active database-driven service locations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markers: Record<string, any> = {};

        activeLocations.forEach((loc) => {
          if (loc.latitude && loc.longitude) {
            const position = { lat: loc.latitude, lng: loc.longitude };

            const pinWrapper = document.createElement("div");
            pinWrapper.className = "nextdrive-google-marker-pin group";
            pinWrapper.innerHTML = `
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
            `;

            const marker = new AdvancedMarkerElement({
              map,
              position,
              title: loc.name,
              content: pinWrapper,
            });

            marker.addListener("click", () => {
              handleSelectLocation(loc);
            });

            markers[loc.id] = marker;
          }
        });

        markersRef.current = markers;
        setJsApiActive(true);
        setMapLoaded(true);
      } catch (err) {
        console.warn("Google Maps JS API init note:", err);
        if (isMounted) {
          setJsApiActive(false);
          setMapLoaded(true);
        }
      }
    }

    initGoogleMap();

    return () => {
      isMounted = false;
      mapInstanceRef.current = null;
    };
  }, [activeLocations, handleSelectLocation]);

  const handleResetView = () => {
    setViewCenter(MANCHESTER_CENTER);
    setViewZoom(DEFAULT_ZOOM);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(MANCHESTER_CENTER);
      mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    }
  };

  // Construct Google Maps Embed URL for Manchester
  const googleMapsEmbedUrl = useMemo(() => {
    const lat = viewCenter.lat.toFixed(4);
    const lng = viewCenter.lng.toFixed(4);
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${viewZoom}&t=m&hl=en&output=embed`;
  }, [viewCenter, viewZoom]);

  const selectedLocation = useMemo(() => {
    return activeLocations.find((l) => l.id === selectedId) || activeLocations[0] || null;
  }, [activeLocations, selectedId]);

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
            {/* When Google Maps JS API is active with key, render canvas */}
            {jsApiActive ? (
              <div
                ref={mapContainerRef}
                className="w-full h-full z-10"
                style={{ minHeight: "100%" }}
              />
            ) : (
              /* High-fidelity Google Maps Manchester View */
              <div className="relative w-full h-full">
                <iframe
                  title="Google Maps Manchester Coverage"
                  src={googleMapsEmbedUrl}
                  className={`w-full h-full border-0 transition-opacity duration-500 ${
                    isDarkMode ? "filter invert-[90%] hue-rotate-180 brightness-90 contrast-95" : ""
                  }`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Interactive Custom NextDrive Map Markers Layer */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                  {activeLocations.map((loc) => {
                    const isSelected = loc.id === selectedId;
                    // Project Greater Manchester coordinates to percentage offsets
                    // Manchester bounds: Lat 53.38 to 53.54 | Lng -2.38 to -2.12
                    const minLat = 53.38;
                    const maxLat = 53.54;
                    const minLng = -2.38;
                    const maxLng = -2.12;

                    const top = Math.max(12, Math.min(84, ((maxLat - (loc.latitude || 53.48)) / (maxLat - minLat)) * 100));
                    const left = Math.max(12, Math.min(88, (((loc.longitude || -2.24) - minLng) / (maxLng - minLng)) * 100));

                    return (
                      <div
                        key={loc.id}
                        style={{ top: `${top}%`, left: `${left}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLocation(loc);
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-transform duration-300 ${
                          isSelected ? "scale-125 z-30" : "hover:scale-115 z-20"
                        }`}
                        title={`${loc.name} (${loc.testCenterName})`}
                      >
                        <div className="nextdrive-google-marker-pin">
                          <div className={`nextdrive-pulse-ring ${isSelected ? "scale-125" : ""}`} />
                          <div className={`nextdrive-marker-body ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-primary" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.7 2 12.2v3.8c0 .6.4 1 1 1h2"/>
                              <circle cx="7" cy="17" r="2"/>
                              <path d="M9 17h6"/>
                              <circle cx="17" cy="17" r="2"/>
                            </svg>
                          </div>
                          <div className="nextdrive-marker-label">
                            {loc.name.split("&")[0].trim()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!mapLoaded && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-card/80 backdrop-blur-xs">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Initializing Google Maps Manchester Canvas...
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
              className="absolute top-3 right-3 z-20 rounded-xl bg-card/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 border border-border text-foreground hover:text-primary transition shadow-xs cursor-pointer"
              title="Reset Manchester Overview"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Active Test Center Floating Card Overlay */}
            {selectedLocation && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs z-30 pointer-events-auto">
                <div className="rounded-2xl border border-border bg-card/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl text-card-foreground">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1">
                    <span className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5" />
                      {selectedLocation.testCenterName}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {selectedLocation.activeInstructors} ADIs
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    {selectedLocation.name}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedLocation.postcodes.slice(0, 4).map((pc) => (
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
                        area: selectedLocation.name,
                        source: "google-maps-floating-card",
                      })
                    }
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3 py-2 text-xs font-bold text-primary-foreground transition shadow-xs cursor-pointer"
                  >
                    <span>Book in {selectedLocation.name.split(" ")[0]}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
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

          <div
            ref={cardsContainerRef}
            className="flex flex-col gap-3 max-h-[580px] overflow-y-auto p-1 scrollbar-thin"
          >
            {filteredLocations.map((loc) => {
              const isSelected = selectedId === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all text-card-foreground group ${
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

      {/* Global CSS for Custom Google Maps Markers and Popups */}
      <style jsx global>{`
        .nextdrive-google-marker-pin {
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
          animation: nextdrive-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
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

        .nextdrive-google-marker-pin:hover .nextdrive-marker-body {
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

        /* Custom Google InfoWindow Content */
        .nextdrive-google-popup-content {
          padding: 12px 14px;
          font-family: inherit;
        }

        .popup-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #4f46e5;
          margin-bottom: 2px;
        }

        .dark .popup-eyebrow {
          color: #38bdf8;
        }

        .popup-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .dark .popup-title {
          color: #f8fafc;
        }

        .popup-desc {
          font-size: 11px;
          color: #64748b;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .dark .popup-desc {
          color: #94a3b8;
        }

        .popup-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          background: #f1f5f9;
          border-radius: 8px;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .dark .popup-badge-row {
          background: #1e293b;
        }

        .popup-badge-testcenter {
          font-weight: 600;
          color: #334155;
        }

        .dark .popup-badge-testcenter {
          color: #e2e8f0;
        }

        .popup-badge-instructors {
          font-weight: 700;
          color: #16a34a;
        }

        .dark .popup-badge-instructors {
          color: #4ade80;
        }

        .popup-postcodes-row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 10px;
        }

        .popup-postcode-chip {
          padding: 2px 6px;
          background: #e2e8f0;
          color: #1e293b;
          font-family: monospace;
          font-size: 10px;
          font-weight: 600;
          border-radius: 4px;
        }

        .dark .popup-postcode-chip {
          background: #334155;
          color: #f1f5f9;
        }

        .popup-book-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 12px;
          background: #4f46e5;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .popup-book-btn:hover {
          background: #4338ca;
        }

        /* Google Maps InfoWindow Container Overrides */
        .gm-style .gm-style-iw-c {
          padding: 0 !important;
          border-radius: 1rem !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }

        .dark .gm-style .gm-style-iw-c {
          background-color: #0f172a !important;
          border: 1px solid #1e293b !important;
        }

        .gm-style .gm-style-iw-d {
          overflow: hidden !important;
          padding: 0 !important;
        }

        .gm-style .gm-style-iw-tc::after {
          background: #ffffff !important;
        }

        .dark .gm-style .gm-style-iw-tc::after {
          background: #0f172a !important;
        }

        @keyframes nextdrive-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nextdrive-pulse-ring {
            animation: none !important;
          }
          .nextdrive-marker-body {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
