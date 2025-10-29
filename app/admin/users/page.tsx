"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Search, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  location: string
  rating: number
  skills: any[]
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          window.location.href = "/auth/login"
          return
        }

        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          setUsers(await res.json())
        }
      } catch (error) {
        toast.error("Failed to load users")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [token])

  const handleDeleteUser = async (userId: string) => {
    setDeleting(userId)

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId))
        toast.success("User deleted successfully")
      }
    } catch (error) {
      toast.error("Failed to delete user")
      console.error(error)
    } finally {
      setDeleting(null)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground">Total: {filteredUsers.length}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      <span>{user.location || "No location"}</span>
                      <span>{user.skills.length} skills</span>
                      <Badge variant="outline">{user.rating.toFixed(1)}/5</Badge>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleting === user._id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {user.firstName} {user.lastName}?
                        This action cannot be undone.
                      </AlertDialogDescription>
                      <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-destructive"
                        >
                          Delete
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
