import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Simplified Category type that matches what's returned from the API
interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description: string;
  active: boolean;
}

interface CategorySectionProps {
  categories: CategoryItem[];
}

// Map of icon names to emoji fallbacks
const iconToEmoji: Record<string, string> = {
  "utensils": "🍽️",
  "coffee": "☕",
  "truck": "🚚",
  "shirt": "👕",
  "laptop": "💻",
  "home": "🏠",
  "gift": "🎁",
  "dumbbell": "💪",
  "scissors": "✂️",
  "stethoscope": "🩺",
  "gavel": "⚖️",
  "dollar-sign": "💰",
  "building": "🏢",
  "pen-tool": "🖋️",
  "spray-can": "🧴",
  "tool": "🔧",
  "tree": "🌳",
  "wrench": "🔧",
  "droplet": "💧",
  "book": "📚",
  "child": "👶",
  "calendar": "📅",
  "film": "🎬",
  "heart": "❤️",
  "shopping-bag": "🛍️"
};

export function CategorySection({ categories }: CategorySectionProps) {
  // Sort categories alphabetically
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Get emoji for icon or fallback
  const getIconDisplay = (iconName?: string) => {
    if (!iconName) return null;
    return iconToEmoji[iconName] || "🔍";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {sortedCategories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5 rounded-full"
            >
              <span className="text-base">{getIconDisplay(category.icon)}</span>
              {category.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
