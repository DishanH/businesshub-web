"use client"

import { useState, useEffect } from "react"
import { Search, Circle, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    sender: "Sweet Delights Bakery",
    avatar: "/placeholder.svg",
    messages: [
      {
        id: 1,
        content: "Hello! We have some exciting new cake flavors available.",
        date: "2024-03-15T10:00:00Z",
        isUser: false,
      },
      {
        id: 2,
        content: "That sounds great! Can you tell me more about them?",
        date: "2024-03-15T10:05:00Z",
        isUser: true,
      },
      {
        id: 3,
        content:
          "We have a new Lemon Lavender cake and a Chocolate Raspberry Truffle cake. Would you like to place an order?",
        date: "2024-03-15T10:10:00Z",
        isUser: false,
      },
    ],
    read: false,
  },
  {
    id: 2,
    sender: "Quick Fix Plumbing",
    avatar: "/placeholder.svg",
    messages: [
      {
        id: 1,
        content: "Your plumbing inspection is scheduled for tomorrow at 2 PM. See you then!",
        date: "2024-03-14T15:30:00Z",
        isUser: false,
      },
      {
        id: 2,
        content: "Thank you for the reminder. I'll be home at that time.",
        date: "2024-03-14T15:35:00Z",
        isUser: true,
      },
    ],
    read: true,
  },
  {
    id: 3,
    sender: "Green Thumb Landscaping",
    avatar: "/placeholder.svg",
    messages: [
      {
        id: 1,
        content: "Get your garden ready for spring with our expert tips and special offers on plants!",
        date: "2024-03-13T09:15:00Z",
        isUser: false,
      },
    ],
    read: false,
  },
  {
    id: 4,
    sender: "Tech Wizards",
    avatar: "/placeholder.svg",
    messages: [
      {
        id: 1,
        content: "Good news! Your device has been repaired and is ready for pickup at our store.",
        date: "2024-03-12T14:45:00Z",
        isUser: false,
      },
      {
        id: 2,
        content: "Great! What are your store hours?",
        date: "2024-03-12T14:50:00Z",
        isUser: true,
      },
      {
        id: 3,
        content: "We're open Monday to Friday from 9 AM to 7 PM, and Saturday from 10 AM to 5 PM.",
        date: "2024-03-12T14:55:00Z",
        isUser: false,
      },
    ],
    read: true,
  },
  {
    id: 5,
    sender: "Fitness First Gym",
    avatar: "/placeholder.svg",
    messages: [
      {
        id: 1,
        content: "We've updated our class schedule for the month. Check it out and book your spot!",
        date: "2024-03-11T11:20:00Z",
        isUser: false,
      },
    ],
    read: false,
  },
]

type Notification = (typeof INITIAL_NOTIFICATIONS)[0]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<"all" | "unread" | "recent">("all")
  const notificationsPerPage = 5

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications((prevNotifications) => [
        {
          id: prevNotifications.length + 1,
          sender: "Local Business Hub",
          avatar: "/placeholder.svg",
          messages: [
            {
              id: 1,
              content: "Thank you for joining Local Business Hub. We're excited to have you on board!",
              date: new Date().toISOString(),
              isUser: false,
            },
          ],
          read: false,
        },
        ...prevNotifications,
      ])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    )
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "recent" &&
        new Date(notification.messages[notification.messages.length - 1].date).getTime() >
          Date.now() - 7 * 24 * 60 * 60 * 1000)

    return matchesSearch && matchesFilter
  })

  const indexOfLastNotification = currentPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification)

  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage)

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notifications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/3 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unread")}>Unread</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("recent")}>Recent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollArea className="h-[600px] rounded-md border">
            {currentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer border-b transition-colors ${
                  notification.read ? "bg-background" : "bg-blue-50 dark:bg-blue-900"
                } ${selectedNotification?.id === notification.id ? "bg-accent" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={notification.avatar} alt={notification.sender} />
                      <AvatarFallback>{notification.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{notification.sender}</div>
                      <div className="text-sm text-muted-foreground">
                        {notification.messages[notification.messages.length - 1].content.substring(0, 30)}...
                      </div>
                    </div>
                  </div>
                  {!notification.read && <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.messages[notification.messages.length - 1].date).toLocaleString()}
                </div>
              </div>
            ))}
          </ScrollArea>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  isActive={currentPage === 1}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  isActive={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div className="lg:w-2/3 rounded-md border">
          {selectedNotification ? (
            <div className="p-4 h-full flex flex-col">
              <div className="mb-4 flex items-center">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={selectedNotification.avatar} alt={selectedNotification.sender} />
                  <AvatarFallback>{selectedNotification.sender[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold">{selectedNotification.sender}</h2>
              </div>
              <ScrollArea className="grow">
                {selectedNotification.messages.map((message) => (
                  <div key={message.id} className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(message.date).toLocaleString()}</div>
                  </div>
                ))}
              </ScrollArea>
              <div className="mt-4 flex">
                <Input placeholder="Type your message..." className="grow mr-2" />
                <Button>Send</Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Select a notification to view the conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

