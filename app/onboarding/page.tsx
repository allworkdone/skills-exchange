"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const SKILL_CATEGORIES = ["Technology", "Music", "Creative", "Language", "Fitness", "Culinary", "Business", "Crafts", "Other"]
const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"]

interface SkillForm {
  name: string
  category: string
  description: string
  proficiencyLevel: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<SkillForm[]>([])
  const [currentSkill, setCurrentSkill] = useState<SkillForm>({
    name: "",
    category: "",
    description: "",
    proficiencyLevel: "Beginner",
  })

  const handleAddSkill = () => {
    if (!currentSkill.name || !currentSkill.category || !currentSkill.description) {
      toast.error("Please fill in all fields")
      return
    }

    setSkills([...skills, currentSkill])
    setCurrentSkill({
      name: "",
      category: "",
      description: "",
      proficiencyLevel: "Beginner",
    })
    toast.success("Skill added!")
  }

 const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleContinue = async () => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill")
      return
    }

    setLoading(true)

    try {
      for (const skill of skills) {
        const response = await fetch("/api/skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(skill),
        })
        
        const responseData = await response.json()
        // Handle the new response format: { status, success, data, message }
        if (!response.ok || !responseData.success) {
          toast.error(responseData.message || "Failed to add skill")
          return
        }
      }

      toast.success("Skills added successfully!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Failed to add skills")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Set Up Your Skills</CardTitle>
            <CardDescription>Add the skills you can offer and what you want to learn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-6 bg-muted rounded-lg">
              <h3 className="font-semibold">Add a Skill</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill Name</label>
                  <Input
                    placeholder="e.g., Web Development, Guitar, Photography"
                    value={currentSkill.name}
                    onChange={(e) =>
                      setCurrentSkill({ ...currentSkill, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={currentSkill.category}
                      onValueChange={(value) =>
                        setCurrentSkill({ ...currentSkill, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proficiency Level</label>
                    <Select
                      value={currentSkill.proficiencyLevel}
                      onValueChange={(value) =>
                        setCurrentSkill({
                          ...currentSkill,
                          proficiencyLevel: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFICIENCY_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your skill, experience, and what you can teach..."
                    value={currentSkill.description}
                    onChange={(e) =>
                      setCurrentSkill({
                        ...currentSkill,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </div>

            {skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Added Skills ({skills.length})</h3>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{skill.name}</h4>
                        <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                            {skill.category}
                          </span>
                          <span className="px-2 py-0.5 bg-muted rounded">
                            {skill.proficiencyLevel}
                          </span>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">{skill.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-4 p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleContinue}
                disabled={loading || skills.length === 0}
              >
                {loading ? "Saving..." : "Continue to Dashboard"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
