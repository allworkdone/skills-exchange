"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { categories } from "@/lib/mock-data"

interface SearchFilterProps {
  searchQuery: string
 selectedCategory: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
}

export function SearchFilter({ searchQuery, selectedCategory, onSearchChange, onCategoryChange }: SearchFilterProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="rounded-full text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-3"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
