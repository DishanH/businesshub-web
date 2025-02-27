"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ArrowRight } from "lucide-react"

const locations = [
  "Toronto",
  "Vancouver",
  "Montreal",
  "Calgary",
  "Ottawa",
  "Edmonton",
  "Winnipeg",
  "Quebec City",
  "Hamilton",
  "Halifax",
]

export function MoveBusinessDrawer() {
  const [currentLocation, setCurrentLocation] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [businessName, setBusinessName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement business move logic
    console.log("Business moved:", { businessName, currentLocation, newLocation })
    // Reset form
    setCurrentLocation("")
    setNewLocation("")
    setBusinessName("")
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Move Business</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Business Location</DrawerTitle>
          <DrawerDescription>Change the location of your business in our directory.</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business name"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="currentLocation">Current Location</Label>
              <Select value={currentLocation} onValueChange={setCurrentLocation}>
                <SelectTrigger id="currentLocation">
                  <SelectValue placeholder="Select current location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ArrowRight className="w-6 h-6" />
            <div className="flex-1">
              <Label htmlFor="newLocation">New Location</Label>
              <Select value={newLocation} onValueChange={setNewLocation}>
                <SelectTrigger id="newLocation">
                  <SelectValue placeholder="Select new location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit">Move Business</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

