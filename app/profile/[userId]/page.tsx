"use client"

import { use, useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, ArrowLeft } from "lucide-react"
import { ExchangeRequestDialog } from "@/components/exchange-request-dialog"
import Link from "next/link"

interface ApiUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  location?: string
  profilePicture?: string
 rating?: number
 skills: string[]
}

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

interface ApiSkill {
  _id: string
 userId: string
 name: string
  category: string
  description: string
  proficiencyLevel: string
  availability: string
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

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const [user, setUser] = useState<User | null>(null)
  const [userSkills, setUserSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (response.ok) {
          const responseData = await response.json()
          // Handle the new response format: { status, success, data, message }
          const userData: ApiUser = responseData.success ? responseData.data.user : responseData
          
          // Transform user data to match expected format
          const transformedUser: User = {
            ...userData,
            id: userData._id,
            name: `${userData.firstName} ${userData.lastName}`,
            avatar: userData.profilePicture || "/placeholder-user.jpg",
            location: userData.location || "Location not specified",
            bio: userData.bio || "No bio available"
          }
          setUser(transformedUser)
          
          // Fetch skills for this user
          const skillsResponse = await fetch(`/api/skills/user/${userId}`)
          if (skillsResponse.ok) {
            const skillsResponseData = await skillsResponse.json()
            // Handle the new response format: { status, success, data, message }
            const skillsData: ApiSkill[] = skillsResponseData.success ? skillsResponseData.data.skills : skillsResponseData
            
            // Transform skills data to match expected format
            const transformedSkills = skillsData.map((skill: ApiSkill) => ({
              id: skill._id,
              userId: skill.userId,
              user: transformedUser,
              offering: skill.name,
              offeringCategory: skill.category,
              seeking: "Not specified", // This field doesn't exist in the API, so using a default
              seekingCategory: "Other", // This field doesn't exist in the API, so using a default
              description: skill.description,
              level: skill.proficiencyLevel as "Beginner" | "Intermediate" | "Advanced" | undefined || "Intermediate",
              availability: skill.availability || "Flexible" // This field doesn't exist in the API, so using a default
            }))
            
            setUserSkills(transformedSkills)
          }
        } else {
          console.error('Failed to fetch user:', response.status)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleRequestExchange = () => {
    if (userSkills.length > 0) {
      setSelectedSkill(userSkills[0])
      setDialogOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </p>
                  </div>

                  <p className="text-foreground leading-relaxed">{user.bio}</p>

                  <Button className="w-full md:w-auto" onClick={handleRequestExchange}>
                    <Mail className="mr-2 h-4 w-4" />
                    Request Exchange
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Offering */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  Offering
                </Badge>
                <span>Skills I Can Teach</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userSkills.length === 0 ? (
                <p className="text-muted-foreground">No skills listed yet.</p>
              ) : (
                <div className="space-y-4">
                  {userSkills.map((skill) => (
                    <div key={`offering-${skill.id}`} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{skill.offering}</h3>
                            <Badge variant="outline">{skill.offeringCategory}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{skill.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Level: {skill.level}</span>
                        <span>•</span>
                        <span>Available: {skill.availability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Seeking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Seeking</Badge>
                <span>Skills I Want to Learn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userSkills.length === 0 ? (
                <p className="text-muted-foreground">No skills listed yet.</p>
              ) : (
                <div className="space-y-4">
                  {userSkills.map((skill) => (
                    <div key={`seeking-${skill.id}`} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{skill.seeking}</h3>
                            <Badge variant="outline">{skill.seekingCategory}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Looking for someone to teach me {skill.seeking.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ExchangeRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} skill={selectedSkill} />
    </div>
  )
}
