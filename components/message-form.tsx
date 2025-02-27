"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function MessageForm({ businessId }: { businessId: number }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement message sending logic
    console.log("Message sent:", { businessId, name, email, message })
    // Reset form
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Textarea placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
      <Button type="submit">Send Message</Button>
    </form>
  )
}

