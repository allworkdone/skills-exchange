"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, LogOut, UserCircle, BarChart3, Menu, X } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"

export function Navbar() {
  const router = useRouter()
 const { user, logout } = useAuth()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/")
  }

 const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Users className="h-6 w-6 text-primary" />
            <span>SkillSwap</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <div className="flex items-center gap-4">
              {!user ? (
                <>
                  <Link href="/">
                    <Button variant="ghost">Browse Skills</Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/">
                    <Button variant="ghost">Browse</Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="ghost">Messages</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <UserCircle className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" onClick={closeMobileMenu}>Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${user?._id}`} onClick={closeMobileMenu}>Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" onClick={closeMobileMenu}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          ) : (
            /* Mobile Navigation */
            <div className="flex items-center">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full mr-2">
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" onClick={closeMobileMenu}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user?._id}`} onClick={closeMobileMenu}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" onClick={closeMobileMenu}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="outline" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <div className={`overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
            <div className="flex flex-col gap-2">
              {!user ? (
                <>
                  <Link href="/" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">Browse Skills</Button>
                  </Link>
                  <Link href="/auth/login" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">Login</Button>
                  </Link>
                  <Link href="/auth/register" onClick={closeMobileMenu}>
                    <Button className="w-full justify-start">Get Started</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">Browse</Button>
                  </Link>
                  <Link href="/chat" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">Messages</Button>
                  </Link>
                  <Link href="/dashboard" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
