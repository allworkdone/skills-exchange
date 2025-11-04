"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { SearchFilter } from "@/components/search-filter"
import { SkillCard } from "@/components/skill-card"
import { ExchangeRequestDialog } from "@/components/exchange-request-dialog"

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

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

 useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills')
        if (response.ok) {
          const responseData = await response.json()
          // Handle the new response format: { status, success, data, message }
          const apiSkills = responseData.success ? responseData.data.skills : responseData
          
          // Transform API skills to match the expected format
          const transformedSkills = apiSkills.map((apiSkill: any) => ({
            id: apiSkill._id,
            userId: apiSkill.user._id,
            user: {
              _id: apiSkill.user._id,
              firstName: apiSkill.user.firstName,
              lastName: apiSkill.user.lastName,
              profilePicture: apiSkill.user.profilePicture,
              location: apiSkill.user.location || "Location not specified",
              bio: apiSkill.user.bio || "No bio available",
              // Add computed fields to match mock data structure
              get name() {
                return `${this.firstName} ${this.lastName}`
              },
              get avatar() {
                return this.profilePicture || "/placeholder-user.jpg"
              }
            },
            offering: apiSkill.name,
            offeringCategory: apiSkill.category,
            seeking: "Not specified", // This field doesn't exist in the API, so using a default
            seekingCategory: "Other", // This field doesn't exist in the API, so using a default
            description: apiSkill.description,
            level: apiSkill.proficiencyLevel as "Beginner" | "Intermediate" | "Advanced" | undefined || "Intermediate",
            availability: "Flexible" // This field doesn't exist in the API, so using a default
          }))
          
          setSkills(transformedSkills)
        }
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      searchQuery === "" ||
      skill.offering.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.seeking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.user.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" ||
      skill.offeringCategory === selectedCategory ||
      skill.seekingCategory === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleViewProfile = (userId: string) => {
    if (userId && userId !== 'undefined') {
      router.push(`/profile/${userId}`)
    } else {
      console.error('Invalid userId provided to handleViewProfile:', userId)
    }
  }

  const handleRequestExchange = (skillId: string) => {
    const skill = skills.find((s) => s.id === skillId)
    if (skill) {
      setSelectedSkill(skill)
      setDialogOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="space-y-8">
          <div className="max-w-2xl mx-auto">
            <SearchFilter
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold">
                Available Skills{" "}
                <span className="text-muted-foreground text-lg font-normal">({filteredSkills.length})</span>
              </h2>
            </div>

            {filteredSkills.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No skills found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onViewProfile={handleViewProfile}
                    onRequestExchange={handleRequestExchange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ExchangeRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} skill={selectedSkill} />
    </div>
  )
}
