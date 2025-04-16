"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TreePine, Droplets, Building2, Wind, ArrowRight, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function InterventionsSection() {
  const [activeTab, setActiveTab] = useState("green")
  const [savedInterventions, setSavedInterventions] = useState<string[]>([])
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSaveIntervention = async (interventionId: string) => {
    try {
      // Check if Supabase is properly initialized
      if (!supabase) {
        // Mock behavior when Supabase is not available
        if (savedInterventions.includes(interventionId)) {
          setSavedInterventions(savedInterventions.filter((id) => id !== interventionId))
          toast({
            title: "Removed from saved",
            description: "Intervention removed from your saved list.",
          })
        } else {
          setSavedInterventions([...savedInterventions, interventionId])
          toast({
            title: "Saved successfully",
            description: "Intervention saved to your profile.",
          })
        }
        return
      }

      // Check if user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to save interventions.",
          variant: "destructive",
        })
        return
      }

      // In a real app, we would save this to the database
      // For now, we'll just update the local state
      if (savedInterventions.includes(interventionId)) {
        setSavedInterventions(savedInterventions.filter((id) => id !== interventionId))
        toast({
          title: "Removed from saved",
          description: "Intervention removed from your saved list.",
        })
      } else {
        setSavedInterventions([...savedInterventions, interventionId])
        toast({
          title: "Saved successfully",
          description: "Intervention saved to your profile.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving this intervention.",
        variant: "destructive",
      })
    }
  }

  return (
    <section id="interventions" className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Eco-Friendly Interventions</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover sustainable solutions to mitigate urban heat islands and create cooler, healthier cities
          </p>
        </div>

        <Tabs defaultValue="green" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="green" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <TreePine className="h-4 w-4 mr-2" />
              Green
            </TabsTrigger>
            <TabsTrigger value="blue" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              <Droplets className="h-4 w-4 mr-2" />
              Blue
            </TabsTrigger>
            <TabsTrigger value="gray" className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-800">
              <Building2 className="h-4 w-4 mr-2" />
              Gray
            </TabsTrigger>
            <TabsTrigger
              value="policy"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              <Wind className="h-4 w-4 mr-2" />
              Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="green">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InterventionCard
                id="green-1"
                title="Urban Forests"
                description="Strategic planting of trees to provide shade, reduce temperatures, and improve air quality."
                image="/placeholder.svg?height=200&width=300"
                impact="High"
                cost="Medium"
                timeframe="Long-term"
                benefits={[
                  "Temperature reduction of 2-8°C",
                  "Carbon sequestration",
                  "Biodiversity support",
                  "Mental health benefits",
                ]}
                isSaved={savedInterventions.includes("green-1")}
                onSave={() => handleSaveIntervention("green-1")}
              />

              <InterventionCard
                id="green-2"
                title="Green Roofs"
                description="Vegetation layers on rooftops that provide insulation, absorb rainwater, and reduce urban heat."
                image="/placeholder.svg?height=200&width=300"
                impact="Medium"
                cost="Medium"
                timeframe="Medium-term"
                benefits={[
                  "Temperature reduction of 1-4°C",
                  "Stormwater management",
                  "Energy savings",
                  "Extended roof life",
                ]}
                isSaved={savedInterventions.includes("green-2")}
                onSave={() => handleSaveIntervention("green-2")}
              />

              <InterventionCard
                id="green-3"
                title="Vertical Gardens"
                description="Plant systems on building facades that provide insulation and cooling through evapotranspiration."
                image="/placeholder.svg?height=200&width=300"
                impact="Medium"
                cost="Medium-High"
                timeframe="Medium-term"
                benefits={[
                  "Temperature reduction of 1-3°C",
                  "Air purification",
                  "Noise reduction",
                  "Aesthetic improvement",
                ]}
                isSaved={savedInterventions.includes("green-3")}
                onSave={() => handleSaveIntervention("green-3")}
              />
            </div>
          </TabsContent>

          <TabsContent value="blue">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InterventionCard
                id="blue-1"
                title="Rain Gardens"
                description="Planted depressions that allow rainwater runoff to be absorbed, filtered, and cooled."
                image="/placeholder.svg?height=200&width=300"
                impact="Medium"
                cost="Low"
                timeframe="Short-term"
                benefits={[
                  "Temperature reduction of 1-2°C",
                  "Flood prevention",
                  "Water purification",
                  "Habitat creation",
                ]}
                isSaved={savedInterventions.includes("blue-1")}
                onSave={() => handleSaveIntervention("blue-1")}
              />

              <InterventionCard
                id="blue-2"
                title="Urban Wetlands"
                description="Restored or created wetland ecosystems that provide natural cooling and water management."
                image="/placeholder.svg?height=200&width=300"
                impact="High"
                cost="High"
                timeframe="Long-term"
                benefits={[
                  "Temperature reduction of 2-5°C",
                  "Flood control",
                  "Biodiversity support",
                  "Recreation opportunities",
                ]}
                isSaved={savedInterventions.includes("blue-2")}
                onSave={() => handleSaveIntervention("blue-2")}
              />

              <InterventionCard
                id="blue-3"
                title="Permeable Pavements"
                description="Surfaces that allow water to pass through, reducing runoff and surface temperatures."
                image="/placeholder.svg?height=200&width=300"
                impact="Medium"
                cost="Medium"
                timeframe="Medium-term"
                benefits={[
                  "Temperature reduction of 1-3°C",
                  "Groundwater recharge",
                  "Reduced flooding",
                  "Improved water quality",
                ]}
                isSaved={savedInterventions.includes("blue-3")}
                onSave={() => handleSaveIntervention("blue-3")}
              />
            </div>
          </TabsContent>

          <TabsContent value="gray">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InterventionCard
                id="gray-1"
                title="Cool Roofs"
                description="Highly reflective surfaces that reflect sunlight and absorb less heat than standard roofs."
                image="/placeholder.svg?height=200&width=300"
                impact="High"
                cost="Low-Medium"
                timeframe="Short-term"
                benefits={[
                  "Temperature reduction of 2-5°C",
                  "Energy savings of 10-40%",
                  "Reduced air pollution",
                  "Extended roof life",
                ]}
                isSaved={savedInterventions.includes("gray-1")}
                onSave={() => handleSaveIntervention("gray-1")}
              />

              <InterventionCard
                id="gray-2"
                title="Cool Pavements"
                description="Reflective or permeable pavement materials that stay cooler than conventional pavements."
                image="/placeholder.svg?height=200&width=300"
                impact="Medium"
                cost="Medium"
                timeframe="Medium-term"
                benefits={[
                  "Temperature reduction of 1-3°C",
                  "Reduced nighttime heat",
                  "Improved comfort",
                  "Reduced energy use",
                ]}
                isSaved={savedInterventions.includes("gray-2")}
                onSave={() => handleSaveIntervention("gray-2")}
              />

              <InterventionCard
                id="gray-3"
                title="Shade Structures"
                description="Architectural elements designed to block direct sunlight and create cooler microclimates."
                image="/placeholder.svg?height=200&width=300"
                impact="Medium"
                cost="Medium"
                timeframe="Short-term"
                benefits={[
                  "Temperature reduction of 2-4°C",
                  "UV protection",
                  "Improved outdoor comfort",
                  "Energy savings",
                ]}
                isSaved={savedInterventions.includes("gray-3")}
                onSave={() => handleSaveIntervention("gray-3")}
              />
            </div>
          </TabsContent>

          <TabsContent value="policy">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InterventionCard
                id="policy-1"
                title="Green Building Codes"
                description="Regulations requiring energy-efficient and heat-mitigating features in new construction."
                image="/placeholder.svg?height=200&width=300"
                impact="High"
                cost="Low (to government)"
                timeframe="Long-term"
                benefits={[
                  "Systematic temperature reduction",
                  "Energy efficiency",
                  "Climate resilience",
                  "Economic benefits",
                ]}
                isSaved={savedInterventions.includes("policy-1")}
                onSave={() => handleSaveIntervention("policy-1")}
              />

              <InterventionCard
                id="policy-2"
                title="Urban Greening Incentives"
                description="Financial incentives for property owners to implement green infrastructure."
                image="/placeholder.svg?height=200&width=300"
                impact="Medium"
                cost="Medium"
                timeframe="Medium-term"
                benefits={[
                  "Distributed cooling effect",
                  "Private sector engagement",
                  "Property value increase",
                  "Community benefits",
                ]}
                isSaved={savedInterventions.includes("policy-2")}
                onSave={() => handleSaveIntervention("policy-2")}
              />

              <InterventionCard
                id="policy-3"
                title="Heat Action Plans"
                description="Comprehensive strategies to prepare for, respond to, and mitigate extreme heat events."
                image="/placeholder.svg?height=200&width=300"
                impact="High"
                cost="Medium"
                timeframe="Medium-term"
                benefits={[
                  "Reduced heat-related illness",
                  "Improved emergency response",
                  "Targeted interventions",
                  "Public awareness",
                ]}
                isSaved={savedInterventions.includes("policy-3")}
                onSave={() => handleSaveIntervention("policy-3")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

interface InterventionCardProps {
  id: string
  title: string
  description: string
  image: string
  impact: string
  cost: string
  timeframe: string
  benefits: string[]
  isSaved: boolean
  onSave: () => void
}

function InterventionCard({
  id,
  title,
  description,
  image,
  impact,
  cost,
  timeframe,
  benefits,
  isSaved,
  onSave,
}: InterventionCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onSave} className={isSaved ? "text-green-600" : "text-gray-400"}>
            {isSaved ? <Check className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            Impact: {impact}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Cost: {cost}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
            Timeframe: {timeframe}
          </Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Benefits:</h4>
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
