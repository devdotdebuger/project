"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThermometerSun, Upload, MapPin, Clock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Mock heat report type
interface HeatReport {
  id: number
  location: string
  temperature: number
  surface_type: string
  description: string
  image_url?: string
  created_at: string
  user_id?: string
  status: "pending" | "verified" | "resolved"
  latitude?: number
  longitude?: number
}

export default function CommunityInputSection() {
  const { toast } = useToast()
  const [temperature, setTemperature] = useState([30])
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [surfaceType, setSurfaceType] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reports, setReports] = useState<HeatReport[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [activeTab, setActiveTab] = useState("submit")
  const supabaseClient = createClientComponentClient()

  // Fetch user session and mock reports
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingReports(true)

        // Check if Supabase is properly initialized
        let userSession = null
        if (supabaseClient) {
          try {
            const { data } = await supabaseClient.auth.getSession()
            userSession = data.session
          } catch (error) {
            console.error("Error fetching Supabase session:", error)
          }
        }

        // Mock reports data
        const mockReports: HeatReport[] = [
          {
            id: 1,
            location: "Downtown Park",
            temperature: 38,
            surface_type: "Asphalt",
            description: "Very hot area with minimal shade. The asphalt is radiating heat significantly.",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "verified",
            latitude: 40.7128,
            longitude: -74.006,
          },
          {
            id: 2,
            location: "Main Street Shopping District",
            temperature: 36,
            surface_type: "Concrete",
            description: "High pedestrian area with few trees. Feels much hotter than surrounding areas.",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: "resolved",
            latitude: 40.7228,
            longitude: -74.016,
          },
          {
            id: 3,
            location: "Riverside Walk",
            temperature: 32,
            surface_type: "Mixed",
            description: "Area near water but still quite hot. Some vegetation but mostly paved surfaces.",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: "pending",
            latitude: 40.7028,
            longitude: -73.996,
          },
        ]

        setReports(mockReports)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load community data.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingReports(false)
      }
    }

    fetchData()
  }, [toast])

  // Update the handleSubmit function to handle Supabase errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is logged in
    let isLoggedIn = false
    let userId = null

    if (supabaseClient) {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession()
        isLoggedIn = !!session
        userId = session?.user.id
      } catch (error) {
        console.error("Error checking Supabase session:", error)
      }
    }

    if (!isLoggedIn && supabaseClient) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a report.",
        variant: "destructive",
      })
      return
    }

    if (!location || !surfaceType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get geolocation (in a real app)
      const latitude = 40.7128 + (Math.random() - 0.5) * 0.1
      const longitude = -74.006 + (Math.random() - 0.5) * 0.1

      // Create new report
      const newReport: HeatReport = {
        id: Date.now(),
        location,
        temperature: temperature[0],
        surface_type: surfaceType,
        description,
        user_id: userId || undefined,
        created_at: new Date().toISOString(),
        status: "pending",
        latitude,
        longitude,
      }

      // Update local reports list
      setReports([newReport, ...reports])

      toast({
        title: "Report Submitted",
        description: "Thank you for your contribution to making our city cooler!",
      })

      // Reset form
      setTemperature([30])
      setLocation("")
      setDescription("")
      setSurfaceType("")
      setImageFile(null)
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <section id="community" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Community Contributions</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Help us identify urban heat islands by reporting hot spots in your community
          </p>
        </div>

        <Tabs defaultValue="submit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="submit">Submit Report</TabsTrigger>
            <TabsTrigger value="view">View Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Report a Hot Spot</CardTitle>
                <CardDescription>
                  Share information about areas in your community that feel unusually hot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter location name or address"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                      <Button type="button" variant="outline" size="icon" title="Use current location">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4" /> Temperature Estimate (°C)
                    </label>
                    <div className="pt-4">
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        min={20}
                        max={50}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>20°C</span>
                        <span>30°C</span>
                        <span>40°C</span>
                        <span>50°C</span>
                      </div>
                      <div className="text-center mt-2 font-medium">{temperature[0]}°C</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Surface Type</label>
                    <Select value={surfaceType} onValueChange={setSurfaceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select surface type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asphalt">Asphalt</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="grass">Grass/Vegetation</SelectItem>
                        <SelectItem value="water">Near Water</SelectItem>
                        <SelectItem value="mixed">Mixed Surfaces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe the area and why it feels hot..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Photo (Optional)</label>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {imageFile ? (
                        <div className="text-center">
                          <p className="text-sm text-gray-600">{imageFile.name}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setImageFile(null)}
                            className="mt-2"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-6">Recent Community Reports</h3>

              {isLoadingReports ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : reports.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-gray-500">No reports have been submitted yet.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("submit")}>
                    Submit the First Report
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {reports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-6">
                          <div className="text-center">
                            <ThermometerSun className="h-12 w-12 mx-auto text-orange-500" />
                            <div className="text-3xl font-bold mt-2">{report.temperature}°C</div>
                            <div className="text-sm text-gray-500">{report.surface_type}</div>
                          </div>
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-semibold">{report.location}</h4>
                            <Badge
                              variant="outline"
                              className={
                                report.status === "verified"
                                  ? "bg-green-50 text-green-700"
                                  : report.status === "resolved"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-yellow-50 text-yellow-700"
                              }
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{report.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(report.created_at)}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {report.user_id ? "Community Member" : "Anonymous"}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              View on Map
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
