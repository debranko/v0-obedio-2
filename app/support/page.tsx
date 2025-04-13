"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowRight, CheckCircle2, HelpCircle, LifeBuoy, Search, Send, Wifi, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data for FAQ items
const faqItems = [
  {
    id: "faq-1",
    question: "How do I provision a new smart button?",
    answer:
      "To provision a new smart button, go to the Devices page and click on 'Provision New Device'. Scan the QR code on the back of the button using the camera or upload a photo of the QR code. Follow the on-screen instructions to complete the setup process.",
  },
  {
    id: "faq-2",
    question: "What should I do if a button has low battery?",
    answer:
      "When a button shows low battery, you should replace the batteries as soon as possible. The smart buttons use standard CR2032 coin cell batteries. To replace, gently open the back cover using the provided tool, remove the old battery, and insert a new one with the positive (+) side facing up.",
  },
  {
    id: "faq-3",
    question: "How do I change the LoRa frequency?",
    answer:
      "To change the LoRa frequency, go to the Settings page and look for the 'LoRa Frequency' section. Select the appropriate frequency (433 MHz, 868 MHz, or 915 MHz) based on your region's regulations. Note that all devices will need to be on the same frequency to communicate properly.",
  },
  {
    id: "faq-4",
    question: "Why is my repeater showing as offline?",
    answer:
      "If a repeater is showing as offline, first check that it's properly connected to power. Verify that the power LED is on. If it's powered but still offline, try moving it closer to other repeaters or the main hub to improve signal strength. You can also try resetting the repeater by pressing the reset button for 10 seconds.",
  },
  {
    id: "faq-5",
    question: "How do I assign crew members to specific rooms?",
    answer:
      "To assign crew members to specific rooms, navigate to the Locations page and select the 'Room Assignment' tab. From there, you can select a room and click 'Assign Crew' to choose which crew member should be responsible for that area. You can also drag and drop crew members onto rooms in the visual floor plan view.",
  },
]

// Mock data for diagnostic tests
const diagnosticTests = [
  {
    id: "test-1",
    name: "Button Connectivity Test",
    description: "Test the connection between a smart button and the system.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "test-2",
    name: "Repeater Signal Test",
    description: "Check signal strength of repeaters throughout the property.",
    icon: <Wifi className="h-5 w-5" />,
  },
  {
    id: "test-3",
    name: "System Health Check",
    description: "Run a comprehensive diagnostic on the entire system.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
]

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [testProgress, setTestProgress] = useState(0)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [issueForm, setIssueForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
  })

  // Filter FAQ items based on search
  const filteredFaqItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Start diagnostic test
  const startTest = (testId: string) => {
    setSelectedTest(testId)
    setTestProgress(0)
    setTestResult(null)

    // Simulate test progress
    const interval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Randomly determine test result for demonstration
          setTestResult(Math.random() > 0.3 ? "success" : "error")
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Handle issue form submission
  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the issue to a backend
    alert("Issue submitted successfully!")
    setIssueForm({
      title: "",
      description: "",
      priority: "medium",
      category: "",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Support</h1>

      <Tabs defaultValue="diagnostics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnostics">Quick Diagnostics</TabsTrigger>
          <TabsTrigger value="faq">Troubleshooting</TabsTrigger>
          <TabsTrigger value="submit">Submit Issue</TabsTrigger>
        </TabsList>

        {/* Diagnostics Tab */}
        <TabsContent value="diagnostics" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>System Diagnostics</CardTitle>
              <CardDescription>Run quick tests to diagnose common issues.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {diagnosticTests.map((test) => (
                  <Card
                    key={test.id}
                    className={`
                      cursor-pointer transition-all duration-200 hover:shadow-md
                      ${selectedTest === test.id ? "ring-2 ring-primary" : ""}
                    `}
                    onClick={() => startTest(test.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">{test.icon}</div>
                        <h3 className="font-medium">{test.name}</h3>
                        <p className="text-sm text-muted-foreground">{test.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            startTest(test.id)
                          }}
                        >
                          Run Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedTest && (
                <div className="mt-6 p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">
                    {diagnosticTests.find((t) => t.id === selectedTest)?.name} - In Progress
                  </h3>
                  <div className="space-y-2">
                    <Progress value={testProgress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>{testProgress}% Complete</span>
                      {testResult && (
                        <span className={testResult === "success" ? "text-green-600" : "text-red-600"}>
                          {testResult === "success" ? "Test Passed" : "Test Failed"}
                        </span>
                      )}
                    </div>

                    {testResult && (
                      <div
                        className={`mt-4 p-3 rounded-lg ${
                          testResult === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {testResult === "success" ? (
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Test completed successfully</p>
                              <p className="text-sm mt-1">All systems are functioning properly.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Test failed</p>
                              <p className="text-sm mt-1">
                                There might be connectivity issues. Please check the device and try again.
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 bg-white"
                                onClick={() => startTest(selectedTest)}
                              >
                                Retry Test
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions and troubleshooting guides.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {filteredFaqItems.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No results found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try searching with different keywords or browse all questions.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                    View All Questions
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqItems.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-sm max-w-none">
                          <p>{item.answer}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start">
                  <LifeBuoy className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Need more help?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you couldn't find the answer you're looking for, please submit a support ticket.
                    </p>
                    <Button
                      variant="link"
                      className="px-0 mt-1"
                      onClick={() =>
                        document
                          .querySelector('[value="submit"]')
                          ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                      }
                    >
                      Submit a support ticket
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submit Issue Tab */}
        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Submit Support Ticket</CardTitle>
              <CardDescription>Describe the issue you're experiencing and we'll help you resolve it.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitIssue} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="issue-title">Issue Title</Label>
                  <Input
                    id="issue-title"
                    placeholder="Brief description of the issue"
                    value={issueForm.title}
                    onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="issue-description">Detailed Description</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Please provide as much detail as possible about the issue you're experiencing..."
                    rows={5}
                    value={issueForm.description}
                    onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="issue-category">Category</Label>
                    <Select
                      value={issueForm.category}
                      onValueChange={(value) => setIssueForm({ ...issueForm, category: value })}
                      required
                    >
                      <SelectTrigger id="issue-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hardware">Hardware Issue</SelectItem>
                        <SelectItem value="software">Software Issue</SelectItem>
                        <SelectItem value="connectivity">Connectivity</SelectItem>
                        <SelectItem value="account">Account Access</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="issue-priority">Priority</Label>
                    <Select
                      value={issueForm.priority}
                      onValueChange={(value) => setIssueForm({ ...issueForm, priority: value })}
                    >
                      <SelectTrigger id="issue-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="issue-attachments">Attachments (Optional)</Label>
                  <Input id="issue-attachments" type="file" multiple />
                  <p className="text-xs text-muted-foreground">
                    You can attach screenshots, logs, or other relevant files (max 10MB per file).
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit" onClick={handleSubmitIssue}>
                <Send className="mr-2 h-4 w-4" />
                Submit Ticket
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
