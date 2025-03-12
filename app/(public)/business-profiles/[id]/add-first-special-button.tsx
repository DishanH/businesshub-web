"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddFirstSpecialButton() {
  const handleClick = () => {
    // Dispatch a custom event to trigger the specials management dialog
    window.dispatchEvent(new CustomEvent('open-specials-management'));
  };

  return (
    <Button 
      variant="outline" 
      className="w-full h-40 flex flex-col items-center justify-center gap-2"
      onClick={handleClick}
    >
      <Plus className="h-8 w-8" />
      <span>Add Your First Special</span>
    </Button>
  );
} 