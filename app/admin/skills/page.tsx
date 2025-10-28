"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Skill {
  _id: string
  name: string
  category: string
  proficiencyLevel: string
  description: string
  user: { firstName: string; lastName: string }
  createdAt: string
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch("/api/admin/skills", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          setSkills(await res.json())
        }
      } catch (error) {
        toast.error("Failed to load skills")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Manage Skills</h1>
            <p className="text-muted-foreground">Total: {filteredSkills.length}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by skill name, category, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {filteredSkills.map((skill) => (
            <Card key={skill._id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-semibold">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {skill.user.firstName} {skill.user.lastName}
                    </p>
                  </div>
                  <div>
                    <Badge variant="outline">{skill.category}</Badge>
                  </div>
                  <div>
                    <Badge>{skill.proficiencyLevel}</Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {new Date(skill.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No skills found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
