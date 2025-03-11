"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getBusinessOwnerById,
  getUsers,
  getMessagesBySenderId,
  getMessagesByReceiverId,
  createMessage,
} from "@/lib/data"
import type { Message } from "@/lib/types"

export default function BusinessOwnerMessagesPage({ params }: { params: { id: string } }) {

  const { id } = params;

  const businessOwner = getBusinessOwnerById(id)
  const user = getUsers().find((u) => u.id === businessOwner?.userId)
  const [messages, setMessages] = useState<Message[]>(
    [...getMessagesBySenderId(user?.id || ""), ...getMessagesByReceiverId(user?.id || "")].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    ),
  )
  const [newMessage, setNewMessage] = useState("")

  if (!businessOwner || !user) {
    return <div>Business owner not found</div>
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = createMessage({
        senderId: "admin",
        receiverId: user.id,
        content: newMessage,
        isRead: false,
      })
      setMessages([message, ...messages])
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/business-owners">Business Owners</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Messages with {user.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold">Messages with {user.name}</h1>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button onClick={handleSendMessage}>Send Message</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle>{message.senderId === "admin" ? "Admin" : user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{message.content}</p>
                <p className="text-sm text-muted-foreground mt-2">{message.timestamp.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

