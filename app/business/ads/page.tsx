import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ManageAds() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Ads</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="ad-title">Ad Title</Label>
          <Input id="ad-title" placeholder="Enter ad title" />
        </div>
        <div>
          <Label htmlFor="ad-description">Ad Description</Label>
          <Textarea id="ad-description" placeholder="Enter ad description" />
        </div>
        <div>
          <Label htmlFor="ad-budget">Daily Budget</Label>
          <Input id="ad-budget" type="number" placeholder="Enter daily budget" />
        </div>
        <Button type="submit">Create Ad</Button>
      </form>
    </div>
  )
}

