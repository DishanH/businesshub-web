import { Metadata } from "next"
import NanniesPageClient from "./components/NanniesPageClient"

export const metadata: Metadata = {
  title: "Find Nannies | BusinessHub",
  description: "Find experienced and caring nannies for your children",
}

export default function NanniesPage() {
  return <NanniesPageClient />;
} 