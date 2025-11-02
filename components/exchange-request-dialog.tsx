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

interface User {
  id: string
  _id: string
  firstName: string
  lastName: string
  name: string
  avatar: string
  location: string
  bio: string
}

interface Skill {
  id: string
  userId: string
  user: User
  offering: string
  offeringCategory: string
  seeking: string
  seekingCategory: string
  description: string
  level: "Beginner" | "Intermediate" | "Advanced"
  availability: string
}

interface ExchangeRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: Skill | null
}

export function ExchangeRequestDialog({ open, onOpenChange, skill }: ExchangeRequestDialogProps) {
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Get the current user's ID from the auth context
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('User not authenticated')
        return
      }
      
      // Get the recipient's skill ID and determine the current user's skill ID
      // For now, we'll assume the current user wants to exchange their first skill
      const currentUserIdResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!currentUserIdResponse.ok) {
        console.error('Failed to get current user')
        return
      }
      const currentUserResponse = await currentUserIdResponse.json()
      // Handle the new response format: { status, success, data, message }
      const currentUserData = currentUserResponse.success ? currentUserResponse.data : currentUserResponse
      const currentUser = currentUserData.user || currentUserData
      
      // Find the current user's skill that matches what the recipient is seeking
      const currentUsersResponse = await fetch(`/api/users/${currentUser._id}`)
      if (!currentUsersResponse.ok) {
        console.error('Failed to get current user details')
        return
      }
      const currentUserDetailsResponse = await currentUsersResponse.json()
      // Handle the new response format: { status, success, data, message }
      const currentUserDetailsData = currentUserDetailsResponse.success ? currentUserDetailsResponse.data : currentUserDetailsResponse
      const currentUserDetails = currentUserDetailsData.user || currentUserDetailsData
      
      const currentUsersSkillsResponse = await fetch(`/api/skills/user/${currentUser._id}`)
      if (!currentUsersSkillsResponse.ok) {
        console.error('Failed to get current user skills')
        return
      }
      const currentUserSkillsResponseData = await currentUsersSkillsResponse.json()
      // Handle the new response format: { status, success, data, message }
      const currentUserSkillsData = currentUserSkillsResponseData.success ? currentUserSkillsResponseData.data.skills : currentUserSkillsResponseData
      const currentUserSkills = Array.isArray(currentUserSkillsData) ? currentUserSkillsData : currentUserSkillsData.skills || []
      
      // For simplicity, we'll use the first skill of the current user
      // In a real implementation, we might want to let the user choose which skill to offer
      const initiatorSkillId = currentUserSkills[0]?._id
      
      if (!initiatorSkillId) {
        console.error('Current user has no skills to offer')
        return
      }
      
      // Prepare the exchange request data
      const exchangeData = {
        recipientId: skill?.user._id || skill?.user.id,
        initiatorSkillId: initiatorSkillId,
        recipientSkillId: skill?.id,
        message: message
      }
      
      // Send the exchange request to the backend
      const response = await fetch('/api/exchanges/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(exchangeData)
      })
      
      const responseData = await response.json()
      // Handle the new response format: { status, success, data, message }
      if (response.ok && responseData.success) {
        console.log('Exchange request sent successfully')
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setMessage("")
          onOpenChange(false)
        }, 2000)
      } else {
        console.error('Failed to send exchange request:', responseData.message || await response.text())
      }
    } catch (error) {
      console.error('Error sending exchange request:', error)
    }
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
