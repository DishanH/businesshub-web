"use client"

import { useState, useEffect } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    sender: "Sweet Delights Bakery",
    subject: "New cake flavors available!",
    message: "Check out our new summer-inspired cake flavors, perfect for your next event!",
    date: "2024-03-15T10:00:00Z",
    read: false,
  },
  {
    id: 2,
    sender: "Quick Fix Plumbing",
    subject: "Appointment confirmation",
    message: "Your plumbing inspection is scheduled for tomorrow at 2 PM. See you then!",
    date: "2024-03-14T15:30:00Z",
    read: true,
  },
  {
    id: 3,
    sender: "Green Thumb Landscaping",
    subject: "Spring gardening tips",
    message: "Get your garden ready for spring with our expert tips and special offers on plants!",
    date: "2024-03-13T09:15:00Z",
    read: false,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [selectedNotification, setSelectedNotification] = useState<(typeof INITIAL_NOTIFICATIONS)[0] | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications((prevNotifications) => [
        {
          id: prevNotifications.length + 1,
          sender: "Tech Wizards",
          subject: "New computer maintenance service",
          message:
            "We're excited to announce our new computer maintenance service. Book now for a special introductory price!",
          date: new Date().toISOString(),
          read: false,
        },
        ...prevNotifications,
      ])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleNotificationClick = (notification: (typeof INITIAL_NOTIFICATIONS)[0]) => {
    setSelectedNotification(notification)
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    )
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full max-h-[800px] items-stretch">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-[52px] items-center justify-between px-4 py-2">
          <h2 className="text-lg font-semibold">Inbox</h2>
          <Button variant="outline" size="sm" onClick={() => alert("Compose functionality to be implemented")}>
            <Mail className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
        <div className="p-4 space-y-2">
          <Input placeholder="Search notifications" />
        </div>
        <div className="px-4 py-2 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-2 rounded-lg cursor-pointer ${notification.read ? "bg-secondary" : "bg-primary/10"}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="font-semibold">{notification.sender}</div>
              <div className="text-sm text-muted-foreground">{notification.subject}</div>
            </div>
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        {selectedNotification ? (
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-2">{selectedNotification.subject}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              From: {selectedNotification.sender} | Date: {new Date(selectedNotification.date).toLocaleString()}
            </p>
            <p>{selectedNotification.message}</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select a notification to view</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

