import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CustomizePages() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Customize Business Page</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="business-name">Business Name</Label>
          <Input id="business-name" defaultValue="Sweet Delights Bakery" />
        </div>
        <div>
          <Label htmlFor="business-description">Business Description</Label>
          <Textarea id="business-description" defaultValue="Artisanal cakes and pastries for all occasions." />
        </div>
        <div>
          <Label htmlFor="business-address">Address</Label>
          <Input id="business-address" defaultValue="123 Main St, Toronto, ON" />
        </div>
        <div>
          <Label htmlFor="business-phone">Phone</Label>
          <Input id="business-phone" defaultValue="(123) 456-7890" />
        </div>
        <div>
          <Label htmlFor="business-website">Website</Label>
          <Input id="business-website" defaultValue="https://sweetdelightsbakery.com" />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}

