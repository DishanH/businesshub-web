"use client";

import { useState, useEffect } from "react";
import BusinessCard from "@/components/business-card";

interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  rating: number;
  image: string;
  likes?: number;
}

export function FeaturedBusinessesClient({ businesses }: { businesses: Business[] }) {
  const [likedBusinesses, setLikedBusinesses] = useState<string[]>([]);

  // Initialize liked businesses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('likedBusinesses');
    if (saved) {
      setLikedBusinesses(JSON.parse(saved));
    }
  }, []);

  const handleLike = (id: string) => {
    setLikedBusinesses((prev) => {
      const newLikes = prev.includes(id)
        ? prev.filter((businessId) => businessId !== id)
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('likedBusinesses', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          onLike={handleLike}
          isLiked={likedBusinesses.includes(business.id)}
          href={`/business-profiles/${business.id}`}
        />
      ))}
    </div>
  );
}

export function NewlyAddedBusinessesClient({ businesses }: { businesses: Business[] }) {
  const [likedBusinesses, setLikedBusinesses] = useState<string[]>([]);

  // Initialize liked businesses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('likedBusinesses');
    if (saved) {
      setLikedBusinesses(JSON.parse(saved));
    }
  }, []);

  const handleLike = (id: string) => {
    setLikedBusinesses((prev) => {
      const newLikes = prev.includes(id)
        ? prev.filter((businessId) => businessId !== id)
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('likedBusinesses', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          onLike={handleLike}
          isLiked={likedBusinesses.includes(business.id)}
          href={`/business-profiles/${business.id}`}
        />
      ))}
    </div>
  );
} 