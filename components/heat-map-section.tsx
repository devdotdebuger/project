"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Info, Layers, ThermometerSun } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

export default function HeatMapSection() {
  const { toast } = useToast()
  const [timeOfDay, setTimeOfDay] = useState("afternoon")
  const [date, setDate] = useState("current")
  const [dataLayer, setDataLayer] = useState("temperature")
  const [temperatureUnit, setTemperatureUnit] = useState("celsius")
  const [opacity, setOpacity] = useState([70])
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map data loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleInfoClick = () => {
    toast({
      title: "About Heat Map Data",
      description:
        "This map displays urban heat island data based on satellite imagery, weather station data, and community reports. The temperature layer shows surface temperature variations across the city.",
    })
  }

  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: "Your heat map report is being generated and will be available for download shortly.",
    })
  }

  return (
    <section id="heatmap" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Urban Heat Island Map</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore temperature variations across the city and identify urban heat islands
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Map Controls
                  <Button variant="ghost" size="icon" onClick={handleInfoClick}>
                    <Info className="h-5 w-5 text-gray-500" />
                  </Button>
                </CardTitle>
                <CardDescription>Adjust map settings and layers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Time Period
                  </label>
                  <Select value={date} onValueChange={setDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ThermometerSun className="h-4 w-4" /> Time of Day
                  </label>
                  <Tabs value={timeOfDay} onValueChange={setTimeOfDay} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="morning">Morning</TabsTrigger>
                      <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
                      <TabsTrigger value="evening">Evening</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Data Layer
                  </label>
                  <Select value={dataLayer} onValueChange={setDataLayer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data layer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="vegetation">Vegetation</SelectItem>
                      <SelectItem value="surfaceType">Surface Type</SelectItem>
                      <SelectItem value="population">Population Density</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Layer Opacity</label>
                  <Slider value={opacity} onValueChange={setOpacity} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature Unit</label>
                  <Tabs value={temperatureUnit} onValueChange={setTemperatureUnit} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="celsius">Celsius</TabsTrigger>
                      <TabsTrigger value="fahrenheit">Fahrenheit</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleGenerateReport}>
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dataLayer === "temperature" && (
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-600 rounded"></div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Cool {temperatureUnit === "celsius" ? "20°C" : "68°F"}</span>
                        <span>Warm {temperatureUnit === "celsius" ? "30°C" : "86°F"}</span>
                        <span>Hot {temperatureUnit === "celsius" ? "40°C" : "104°F"}</span>
                      </div>
                    </div>
                  )}

                  {dataLayer === "vegetation" && (
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gradient-to-r from-gray-400 to-green-600 rounded"></div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  )}

                  {dataLayer === "surfaceType" && (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-800 mr-2"></div>
                        <span className="text-xs">Asphalt/Concrete</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-300 mr-2"></div>
                        <span className="text-xs">Bare Soil</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-600 mr-2"></div>
                        <span className="text-xs">Vegetation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                        <span className="text-xs">Water</span>
                      </div>
                    </div>
                  )}

                  {dataLayer === "population" && (
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gradient-to-r from-blue-100 via-blue-400 to-blue-800 rounded"></div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-0 overflow-hidden rounded-lg">
                <MapComponent
                  dataLayer={dataLayer}
                  timeOfDay={timeOfDay}
                  date={date}
                  opacity={opacity[0] / 100}
                  temperatureUnit={temperatureUnit}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
