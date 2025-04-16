"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your CoolCity assistant. How can I help you learn about urban heat islands and cooling solutions today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("heat island")) {
        response =
          "Urban Heat Islands are urban areas that are significantly warmer than surrounding rural areas due to human activities. They're caused by dark surfaces like asphalt and concrete that absorb heat, lack of vegetation, waste heat from vehicles and buildings, and urban geometry that traps heat."
      } else if (input.toLowerCase().includes("solution") || input.toLowerCase().includes("cool")) {
        response =
          "There are many solutions to cool urban areas! These include: planting trees and vegetation (green infrastructure), installing cool/reflective roofs and pavements, creating more water features (blue infrastructure), improving building design, and implementing policy changes like green building codes."
      } else if (input.toLowerCase().includes("report") || input.toLowerCase().includes("contribute")) {
        response =
          "You can contribute by reporting hot spots in your community using our reporting tool in the Community section. Your reports help us identify areas that need cooling interventions. You can also earn rewards for your contributions!"
      } else {
        response =
          "Thanks for your question! I'm here to help with information about urban heat islands, cooling solutions, and how you can contribute to making our cities cooler and more sustainable. Is there something specific about urban climate you'd like to know?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-green-600 hover:bg-green-700"
        onClick={toggleChat}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-xl z-50 border-green-100">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
              CoolCity Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 h-80 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
