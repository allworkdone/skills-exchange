"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import SocketService from "@/lib/socket"

interface Chat {
  _id: string
  users: Array<{ _id: string; firstName: string; lastName: string; profilePicture?: string }>
  exchange?: { _id: string; status: string }
  messages: Array<{
    _id: string
    sender: { _id: string; firstName: string; lastName: string }
    content: string
    timestamp: string
    read: boolean
  }>
  updatedAt: string
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { token, user } = useAuth()
  const socketService = SocketService.getInstance()

  useEffect(() => {
    if (!token) return;
    socketService.connect(token);

    const fetchChats = async () => {
      try {
        if (!token) {
          window.location.href = "/auth/login"
          return
        }

        const res = await fetch("/api/chats", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          setChats(data)
          if (data.length > 0) {
            setSelectedChat(data[0])
          }
        }
      } catch (error) {
        toast.error("Failed to load chats")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchChats();
    
    socketService.on('new_message', (data) => {
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              messages: [...chat.messages, data.message],
              updatedAt: new Date().toISOString()
            };
          }
          return chat;
        });
      });

      if (selectedChat && selectedChat._id === data.chatId) {
        setSelectedChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message],
            updatedAt: new Date().toISOString()
          };
        });
      }
    });

    return () => {
      socketService.off('new_message');
    };
  }, [token])

  useEffect(() => {
    if (selectedChat && token) {
      socketService.joinChat(selectedChat._id);
    }
  }, [selectedChat?._id, token])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [selectedChat?.messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !selectedChat) return

    setSending(true)

    try {
      const res = await fetch(`/api/chats/${selectedChat._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: message }),
      })

      if (res.ok) {
        const data = await res.json()
        setSelectedChat(data.chat)
        setMessage("")
        socketService.sendMessage({
          chatId: selectedChat._id,
          message: {
            _id: data.chat.messages[data.chat.messages.length - 1]._id,
            sender: { _id: user?._id, firstName: user?.firstName, lastName: user?.lastName },
            content: message,
            timestamp: new Date().toISOString(),
            read: false
          }
        });
      }
    } catch (error) {
      toast.error("Failed to send message")
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  if (chats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No chats yet. Start exchanging skills!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const otherUser = selectedChat?.users.find(
    (u) => u._id !== user?._id
  )

  return (
    <div className="container mx-auto px-4 py-12 h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2 p-4">
                {chats.map((chat) => {
                  const other = chat.users.find(
                    (u) => u._id !== user?._id
                  )
                  return (
                    <button
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedChat?._id === chat._id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted border-transparent"
                      }`}
                    >
                      <p className="font-medium text-sm">
                        {other?.firstName} {other?.lastName}
                      </p>
                      <p className="text-xs opacity-75 truncate">
                        {chat.messages[chat.messages.length - 1]?.content || "No messages"}
                      </p>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedChat && (
          <Card className="md:col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {otherUser?.firstName} {otherUser?.lastName}
                  </CardTitle>
                  {selectedChat.exchange && (
                    <Badge className="mt-2" variant="outline">
                      {selectedChat.exchange.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-[calc(100vh-300px)]" ref={scrollRef}>
                <div className="space-y-4 p-6">
                  {selectedChat.messages.map((msg) => {
                    const isOwn = msg.sender._id === user?._id
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
