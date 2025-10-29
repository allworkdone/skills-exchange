"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, MapPin, Clock } from "lucide-react"

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

interface SkillCardProps {
  skill: Skill
  onViewProfile: (userId: string) => void
  onRequestExchange: (skillId: string) => void
}

export function SkillCard({ skill, onViewProfile, onRequestExchange }: SkillCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={skill.user.avatar || "/placeholder.svg"} alt={skill.user.name} />
            <AvatarFallback>
              {skill.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight">{skill.user.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {skill.user.location}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                Offering
              </Badge>
              <Badge variant="outline">{skill.offeringCategory}</Badge>
            </div>
            <p className="font-semibold text-foreground">{skill.offering}</p>
          </div>

          <div className="flex items-center justify-center py-2">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Seeking</Badge>
              <Badge variant="outline">{skill.seekingCategory}</Badge>
            </div>
            <p className="font-semibold text-foreground">{skill.seeking}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {skill.availability}
          </div>
          <Badge variant="outline" className="text-xs">
            {skill.level}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onViewProfile(skill.userId)}>
          View Profile
        </Button>
        <Button className="flex-1" onClick={() => onRequestExchange(skill.id)}>
          Request Exchange
        </Button>
      </CardFooter>
    </Card>
  )
}
