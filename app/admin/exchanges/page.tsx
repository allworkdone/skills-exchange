"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Exchange {
  _id: string
  status: string
  initiator: { firstName: string; lastName: string }
  recipient: { firstName: string; lastName: string }
  initiatorSkill: { name: string }
  recipientSkill: { name: string }
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
}

export default function AdminExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch("/api/admin/exchanges", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          setExchanges(await res.json())
        }
      } catch (error) {
        toast.error("Failed to load exchanges")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchExchanges()
  }, [])

  const filteredExchanges = statusFilter === "all"
    ? exchanges
    : exchanges.filter((e) => e.status === statusFilter)

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
            <h1 className="text-3xl font-bold">Manage Exchanges</h1>
            <p className="text-muted-foreground">Total: {filteredExchanges.length}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exchanges</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filteredExchanges.map((exchange) => (
            <Card key={exchange._id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">
                      {exchange.initiator.firstName} {exchange.initiator.lastName}
                      {" ↔ "}
                      {exchange.recipient.firstName} {exchange.recipient.lastName}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{exchange.initiatorSkill.name}</span>
                      <span>→</span>
                      <span>{exchange.recipientSkill.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(exchange.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={STATUS_COLORS[exchange.status]}>
                    {exchange.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExchanges.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No exchanges found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
