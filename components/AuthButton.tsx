"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";

interface AuthButtonProps extends ButtonProps {
  defaultTab?: "sign-in" | "sign-up";
  label?: string;
}

export function AuthButton({
  defaultTab = "sign-in",
  label,
  ...props
}: AuthButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} {...props}>
        {label || (defaultTab === "sign-in" ? "Sign In" : "Sign Up")}
      </Button>
      <AuthDialog
        defaultTab={defaultTab}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
} 