"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { SearchFilter } from "@/components/search-filter"
import { SkillCard } from "@/components/skill-card"
import { ExchangeRequestDialog } from "@/components/exchange-request-dialog"
import { mockSkills, type Skill } from "@/lib/mock-data"

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredSkills = mockSkills.filter((skill) => {
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
    router.push(`/profile/${userId}`)
  }

  const handleRequestExchange = (skillId: string) => {
    const skill = mockSkills.find((s) => s.id === skillId)
    if (skill) {
      setSelectedSkill(skill)
      setDialogOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="container mx-auto px-4 py-12">
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
            <div className="flex items-center justify-between mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
