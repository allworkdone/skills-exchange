"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Zap, TrendingUp, Settings } from "lucide-react"
import { toast } from "sonner"

interface DashboardStats {
  stats: {
    totalUsers: number
    totalSkills: number
    totalExchanges: number
    completedExchanges: number
    successRate: number
    averageRating: number
  }
  recentExchanges: any[]
  topUsers: any[]
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          window.location.href = "/auth/login"
          return
        }

        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 403) {
          toast.error("You don't have admin access")
          window.location.href = "/dashboard"
          return
        }

        if (res.ok) {
          setData(await res.json())
        }
      } catch (error) {
        toast.error("Failed to load admin dashboard")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Admin access required</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { stats, recentExchanges, topUsers } = data

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage platform and view analytics</p>
          </div>
          <Link href="/admin/settings">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Skills</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalSkills}</p>
                </div>
                <Zap className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold mt-2">{stats.successRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Statistics</CardTitle>
              <CardDescription>Platform activity overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Exchanges</span>
                <span className="text-2xl font-bold">{stats.totalExchanges}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="text-2xl font-bold">{stats.completedExchanges}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Rating</span>
                <span className="text-2xl font-bold">{stats.averageRating.toFixed(2)}/5</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Management</CardTitle>
              <CardDescription>Quick access to management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users">
                <Button className="w-full justify-start" variant="outline">
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/skills">
                <Button className="w-full justify-start" variant="outline">
                  Manage Skills
                </Button>
              </Link>
              <Link href="/admin/exchanges">
                <Button className="w-full justify-start" variant="outline">
                  Manage Exchanges
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Rated Users</CardTitle>
            <CardDescription>Users with highest community ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.skills.length} skills</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{user.rating.toFixed(2)}/5</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Exchanges</CardTitle>
            <CardDescription>Latest exchange requests and completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExchanges.map((exchange) => (
                <div key={exchange._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {exchange.initiator.firstName} ↔ {exchange.recipient.firstName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exchange.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{exchange.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
