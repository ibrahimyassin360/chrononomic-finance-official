"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Loader2, AlertCircle } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { scheduleContact } from "@/services/chronon-economy-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CONTACT_RATES } from "@/types/chronon-economy"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ContactRatesList() {
  const { account } = useWallet()
  const [schedulingId, setSchedulingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<(typeof CONTACT_RATES)[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")

  const handleOpenDialog = (contactId: string) => {
    const contact = CONTACT_RATES.find((c) => c.id === contactId)
    if (contact) {
      setSelectedContact(contact)
      setDialogOpen(true)
    }
  }

  const handleSchedule = async () => {
    if (!account || !selectedContact || !selectedDate) return

    setSchedulingId(selectedContact.id)
    setError(null)
    setSuccess(null)

    try {
      const result = await scheduleContact(account, selectedContact.id, new Date(selectedDate))
      if (result.success) {
        setSuccess(`Successfully scheduled ${selectedContact.description} for ${result.chrononsSpent} χ`)
        setDialogOpen(false)
      }
    } catch (err: any) {
      console.error("Error scheduling contact:", err)
      setError(err.message || "Failed to schedule contact")
    } finally {
      setSchedulingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTACT_RATES.map((contactRate) => (
          <Card key={contactRate.id} className="overflow-hidden">
            <div className="bg-primary/10 p-4">
              <h3 className="font-medium">
                {contactRate.contactType === "ceo" ? "CEO Consultation" : "AI-Advisor Session"}
              </h3>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{contactRate.duration} hour</span>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm mb-4">{contactRate.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-lg">
                  {contactRate.chrononsRequired} χ
                </Badge>
                <Button onClick={() => handleOpenDialog(contactRate.id)} disabled={schedulingId === contactRate.id}>
                  {schedulingId === contactRate.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Schedule {selectedContact?.contactType === "ceo" ? "CEO Consultation" : "AI-Advisor Session"}
            </DialogTitle>
            <DialogDescription>
              Select a date and time for your {selectedContact?.description.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date and Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Sessions are subject to availability and confirmation
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={!selectedDate}>
              Schedule for {selectedContact?.chrononsRequired} χ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
