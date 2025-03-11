"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddFirstServiceButton() {
  const handleClick = () => {
    const manageServicesButton = document.querySelector('[data-manage-services-button]');
    if (manageServicesButton) {
      (manageServicesButton as HTMLButtonElement).click();
    }
  };

  return (
    <Button 
      className="flex items-center"
      onClick={handleClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Your First Service
    </Button>
  );
} 