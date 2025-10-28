"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Star, Users, Zap } from "lucide-react"
import { toast } from "sonner"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  rating: number
  profilePicture?: string
  bio?: string
  location?: string
}

interface Skill {
  _id: string
  name: string
  category: string
  proficiencyLevel: string
  description: string
}

interface Exchange {
  _id: string
  status: string
  initiatorSkill: Skill
  recipientSkill: Skill
  createdAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          window.location.href = "/auth/login"
          return
        }

        const [userRes, skillsRes, exchangesRes] = await Promise.all([
          fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/skills/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/exchanges", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (userRes.ok) {
          setUser(await userRes.json())
        }
        if (skillsRes.ok) {
          setSkills(await skillsRes.json())
        }
        if (exchangesRes.ok) {
          setExchanges(await exchangesRes.json())
        }
      } catch (error) {
        toast.error("Failed to load dashboard")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  const completedExchanges = exchanges.filter((e) => e.status === "completed").length
  const pendingExchanges = exchanges.filter((e) => e.status === "pending").length

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground mt-2">Manage your skills and exchanges</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skills Offered</p>
                  <p className="text-2xl font-bold mt-1">{skills.length}</p>
                </div>
                <Zap className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Exchanges</p>
                  <p className="text-2xl font-bold mt-1">{completedExchanges}</p>
                </div>
                <Users className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold">{user?.rating.toFixed(1)}</p>
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <Star className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold mt-1">{pendingExchanges}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">My Skills</TabsTrigger>
            <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Skills You're Offering</h2>
              <Link href="/onboarding">
                <Button>Add New Skill</Button>
              </Link>
            </div>

            {skills.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No skills added yet</p>
                  <Link href="/onboarding">
                    <Button>Add Your First Skill</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <Card key={skill._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{skill.name}</CardTitle>
                          <CardDescription>{skill.category}</CardDescription>
                        </div>
                        <Badge variant="outline">{skill.proficiencyLevel}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {skill.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="exchanges" className="space-y-4">
            <h2 className="text-xl font-bold">Exchange History</h2>

            {exchanges.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No exchanges yet</p>
                  <Link href="/">
                    <Button>Browse Skills</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {exchanges.map((exchange) => (
                  <Card key={exchange._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {exchange.initiatorSkill.name} ↔ {exchange.recipientSkill.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: <Badge className="mt-2">{exchange.status}</Badge>
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h2 className="text-xl font-bold">Profile Information</h2>
            <Card>
              <CardHeader>
                <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{user?.location || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="font-medium">{user?.bio || "No bio yet"}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
