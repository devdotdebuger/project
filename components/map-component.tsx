"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface MapComponentProps {
  dataLayer: string
  timeOfDay: string
  date: string
  opacity: number
  temperatureUnit: string
}

// Define the heat data point type
interface HeatPoint {
  lat: number
  lng: number
  value: number // temperature or other value
}

export default function MapComponent({ dataLayer, timeOfDay, date, opacity, temperatureUnit }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [map, setMap] = useState<any | null>(null)
  const leafletHeatLayerRef = useRef<any>(null)

  // Initialize map when component mounts
  useEffect(() => {
    // This is a client-side only component, so we need to import leaflet dynamically
    const initializeMap = async () => {
      try {
        setIsLoading(true)

        // Dynamic imports for Leaflet (only in browser)
        const L = (await import("leaflet")).default
        await import("leaflet/dist/leaflet.css")

        // We would also import the heat plugin in a real implementation
        // await import('leaflet.heat')

        if (!mapRef.current || map) return

        // Create map centered on New York City (for example)
        const leafletMap = L.map(mapRef.current).setView([40.7128, -74.006], 13)

        // Add tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(leafletMap)

        // Add some markers for temperature points if in temperature mode
        if (dataLayer === "temperature") {
          // Add a few temperature markers
          const markers = [
            { lat: 40.7128, lng: -74.006, temp: temperatureUnit === "celsius" ? 38 : 100 },
            { lat: 40.7228, lng: -74.016, temp: temperatureUnit === "celsius" ? 32 : 90 },
            { lat: 40.7028, lng: -73.996, temp: temperatureUnit === "celsius" ? 26 : 79 },
          ]

          markers.forEach((marker) => {
            const tempIcon = L.divIcon({
              html: `<div class="bg-white/80 px-2 py-1 rounded text-xs font-medium ${
                marker.temp > (temperatureUnit === "celsius" ? 35 : 95)
                  ? "text-red-600"
                  : marker.temp > (temperatureUnit === "celsius" ? 30 : 86)
                    ? "text-yellow-600"
                    : "text-green-600"
              }">${marker.temp}°${temperatureUnit === "celsius" ? "C" : "F"}</div>`,
              className: "temperature-marker",
            })

            L.marker([marker.lat, marker.lng], { icon: tempIcon }).addTo(leafletMap)
          })
        }

        setMap(leafletMap)
        setIsLoading(false)

        // In a real implementation, we would add heat layers here based on the dataLayer prop
      } catch (error) {
        console.error("Error initializing map:", error)
        toast({
          title: "Map Error",
          description: "There was an error loading the map. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    initializeMap()

    // Cleanup
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [map, toast, dataLayer, temperatureUnit])

  // Update map when props change
  useEffect(() => {
    if (!map) return

    // In a real implementation, we would update the map layers here based on the props
  }, [map, dataLayer, timeOfDay, date, opacity, temperatureUnit])

  return (
    <div className="relative w-full h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )}

      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  )
}
