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
            <h3 className="font-semibold text-base leading-tight truncate">{skill.user.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{skill.user.location}</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                Offering
              </Badge>
              <Badge variant="outline">{skill.offeringCategory}</Badge>
            </div>
            <p className="font-semibold text-foreground break-words">{skill.offering}</p>
          </div>

          <div className="flex items-center justify-center py-2">
            <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
            <ArrowRight className="h-4 w-4 text-muted-foreground sm:hidden" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary">Seeking</Badge>
              <Badge variant="outline">{skill.seekingCategory}</Badge>
            </div>
            <p className="font-semibold text-foreground break-words">{skill.seeking}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">{skill.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{skill.availability}</span>
          </div>
          <Badge variant="outline" className="text-xs self-start sm:self-auto">
            {skill.level}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="w-full sm:flex-1 bg-transparent" onClick={() => onViewProfile(skill.userId)}>
          View Profile
        </Button>
        <Button className="w-full sm:flex-1" onClick={() => onRequestExchange(skill.id)}>
          Request Exchange
        </Button>
      </CardFooter>
    </Card>
  )
}
