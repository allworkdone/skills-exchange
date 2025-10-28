import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Users className="h-6 w-6 text-primary" />
            <span>SkillSwap</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Browse Skills</Button>
            </Link>
            <Button>List Your Skills</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
