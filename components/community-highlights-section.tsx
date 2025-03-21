import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { CommunityHighlights } from "@/components/community-highlights";
import { Button } from "@/components/ui/button";

function SectionHeading({
  icon,
  title,
  showViewAll = false,
  location = "toronto",
}: {
  icon: React.ReactNode;
  title: string;
  showViewAll?: boolean;
  location?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg font-medium tracking-tight text-foreground/90">{title}</h2>
      </div>
      {showViewAll && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-sm font-medium text-primary hover:text-primary/80 hover:bg-transparent px-2 py-1"
        >
          <Link href={`/community?location=${location}`} className="flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
    </div>
  );
}

interface CommunityHighlightsSectionProps {
  locationId?: string;
}

export function CommunityHighlightsSection({ locationId = "toronto" }: CommunityHighlightsSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeading
        icon={<Newspaper className="h-5 w-5 text-primary" />}
        title="Community Highlights"
        showViewAll={true}
        location={locationId}
      />
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 md:p-8">
        <CommunityHighlights locationId={locationId} />
      </div>
    </div>
  );
} 