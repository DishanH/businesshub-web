import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Information Collection and Use</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            We collect information you provide directly to us when you register for an account, create or modify your
            profile, set preferences, or make purchases through the Service.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            We use the information we collect about you to provide, maintain, and improve our services, to develop new
            ones, and to protect Local Business Hub and our users.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sharing of Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            We do not share, sell, rent or trade your personal information with third parties for their commercial
            purposes except as outlined in this policy or with your consent.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            If you have any questions about this Privacy Policy, please contact us at privacy@localbusinesshub.com.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

