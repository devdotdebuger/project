import { Button } from "@/components/ui/button"
import { ArrowRight, ThermometerSun, Wind, Droplets, TreePine } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-orange-50 py-16 md:py-24">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="text-green-600">Cool</span> Cities,
              <span className="text-orange-500"> Healthy</span> Communities
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Mapping urban heat islands and designing eco-friendly interventions to create cooler, more sustainable
              cities for everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="#heatmap">
                  Explore Heat Map <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" asChild>
                <Link href="#community">Join Community</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                    <ThermometerSun className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Temperature Mapping</h3>
                  <p className="mt-2 text-sm text-gray-500">Real-time heat data visualization across urban areas</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                    <TreePine className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Green Solutions</h3>
                  <p className="mt-2 text-sm text-gray-500">Eco-friendly interventions to cool urban spaces</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                    <Wind className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Microclimate Analysis</h3>
                  <p className="mt-2 text-sm text-gray-500">Detailed analysis of local climate conditions</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                    <Droplets className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Community Engagement</h3>
                  <p className="mt-2 text-sm text-gray-500">Collaborative approach to urban cooling</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 to-red-600/80 mix-blend-multiply"></div>
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Urban heat island visualization"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-6 bg-black/30 backdrop-blur-sm rounded-lg">
                <h3 className="text-2xl font-bold">Urban Heat Islands</h3>
                <p className="mt-2">Areas up to 7°C warmer than surrounding regions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
