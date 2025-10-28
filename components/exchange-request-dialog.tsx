"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import type { Skill } from "@/lib/mock-data"

interface ExchangeRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: Skill | null
}

export function ExchangeRequestDialog({ open, onOpenChange, skill }: ExchangeRequestDialogProps) {
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Exchange request submitted:", { skillId: skill?.id, message })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setMessage("")
      onOpenChange(false)
    }, 2000)
  }

  const handleClose = () => {
    setSubmitted(false)
    setMessage("")
    onOpenChange(false)
  }

  if (!skill) return null

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Request Sent!</h3>
              <p className="text-muted-foreground">
                Your exchange request has been sent to {skill.user.name}. They'll be in touch soon!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Skill Exchange</DialogTitle>
          <DialogDescription>Send a message to propose a skill exchange with {skill.user.name}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={skill.user.avatar || "/placeholder.svg"} alt={skill.user.name} />
              <AvatarFallback>
                {skill.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{skill.user.name}</p>
              <p className="text-sm text-muted-foreground">{skill.user.location}</p>
            </div>
          </div>

          {/* Exchange Details */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Exchange Details</Label>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    They Offer
                  </Badge>
                  <Badge variant="outline">{skill.offeringCategory}</Badge>
                </div>
                <p className="font-medium">{skill.offering}</p>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">They Seek</Badge>
                  <Badge variant="outline">{skill.seekingCategory}</Badge>
                </div>
                <p className="font-medium">{skill.seeking}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-base font-semibold">
              Your Message
            </Label>
            <Textarea
              id="message"
              placeholder={`Hi ${skill.user.name.split(" ")[0]}, I'm interested in exchanging skills with you. I can help you with ${skill.seeking.toLowerCase()} in exchange for learning ${skill.offering.toLowerCase()}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Introduce yourself and explain what you can offer in exchange.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!message.trim()}>
              Send Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
