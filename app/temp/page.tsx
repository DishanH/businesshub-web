"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: typeof google.maps.places.Autocomplete;
        };
      };
    };
  }
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceDetails {
  formatted_address?: string;
  address_components?: AddressComponent[];
  geometry?: google.maps.places.PlaceGeometry;
}

export default function AddressTestPage() {
  const [address, setAddress] = useState("")
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && scriptLoaded) {
      const addressInput = document.getElementById('address-test-input') as HTMLInputElement
      if (addressInput) {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
          componentRestrictions: { country: "CA" },
          fields: ['address_components', 'formatted_address', 'geometry'],
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          console.log("Selected place:", place)
          
          // Transform the place result to match our PlaceDetails interface
          const placeInfo: PlaceDetails = {
            formatted_address: place.formatted_address,
            address_components: place.address_components?.map(component => ({
              long_name: component.long_name,
              short_name: component.short_name,
              types: component.types
            })),
            geometry: place.geometry
          }
          
          setPlaceDetails(placeInfo)
          if (place.formatted_address) {
            setAddress(place.formatted_address)
          }
        })
      }
    }
  }, [scriptLoaded])

  return (
    <div className="container py-10 space-y-8">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCwxqsBze-6BFAf9jfR_8US5jU6ELEhSoE&libraries=places`}
        onLoad={() => {
          console.log("Google Maps script loaded")
          setScriptLoaded(true)
        }}
        onError={(e) => {
          console.error("Error loading Google Maps script:", e)
        }}
      />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Address Test Page</h1>
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Address Input</label>
          <Input
            id="address-test-input"
            placeholder="Start typing an address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Selected Address Details:</h2>
          <pre className="bg-slate-100 p-4 rounded-lg overflow-auto">
            {placeDetails ? JSON.stringify(placeDetails, null, 2) : "No address selected"}
          </pre>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Address Components:</h2>
          {placeDetails?.address_components && (
            <div className="space-y-1">
              {placeDetails.address_components.map((component, index) => (
                <div key={index} className="text-sm">
                  <strong>{component.types.join(', ')}:</strong> {component.long_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={() => {
            console.log("Current address:", address)
            console.log("Place details:", placeDetails)
          }}
        >
          Log Current Values
        </Button>
      </div>
    </div>
  )
} 