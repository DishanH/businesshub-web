"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from "@/components/ui/alert";

export function VerificationSuccess() {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if the URL has the verified parameter
    if (searchParams.get("verified") === "true") {
      setShow(true);
      
      // Hide the alert after 10 seconds
      const timer = setTimeout(() => {
        setShow(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  
  if (!show) return null;
  
  return (
    <Alert className="bg-green-50 border-green-200 mb-6">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <AlertTitle className="text-green-800">Email Verified!</AlertTitle>
      <AlertDescription className="text-green-700">
        Your email has been successfully verified and your account is now active.
        You can now access all features of the platform.
      </AlertDescription>
    </Alert>
  );
} 