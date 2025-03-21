import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  Cpu,
  Home,
  ChefHat,
  Scissors,
  Car,
  GraduationCap,
  BriefcaseBusiness,
  Dog,
  Coffee,
  Shirt,
  Gift,
  Dumbbell,
} from "lucide-react";

interface Category {
  name: string;
  icon: React.ReactNode;
  emoji: string;
  slug: string;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    name: "Restaurants",
    icon: <UtensilsCrossed strokeWidth={1.5} />,
    emoji: "🍽️",
    slug: "restaurants",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-500 to-red-500",
  },
  {
    name: "Coffee",
    icon: <Coffee strokeWidth={1.5} />,
    emoji: "☕",
    slug: "coffee-shops",
    color: "from-amber-600 to-yellow-700",
    bgColor: "bg-gradient-to-br from-amber-600 to-yellow-700",
  },
  {
    name: "Shopping",
    icon: <ShoppingBag strokeWidth={1.5} />,
    emoji: "🛍️",
    slug: "shopping",
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-gradient-to-br from-emerald-500 to-green-500",
  },
  {
    name: "Health",
    icon: <Heart strokeWidth={1.5} />,
    emoji: "🩺",
    slug: "health-wellness",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-rose-500 to-pink-500",
  },
  {
    name: "Technology",
    icon: <Cpu strokeWidth={1.5} />,
    emoji: "💻",
    slug: "technology",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-violet-500 to-purple-500",
  },
  {
    name: "Home Services",
    icon: <Home strokeWidth={1.5} />,
    emoji: "🏠",
    slug: "home-services",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-gradient-to-br from-amber-500 to-yellow-500",
  },
  {
    name: "Food",
    icon: <ChefHat strokeWidth={1.5} />,
    emoji: "🍴",
    slug: "food",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-red-500 to-orange-500",
  },
  {
    name: "Beauty",
    icon: <Scissors strokeWidth={1.5} />,
    emoji: "✂️",
    slug: "beauty",
    color: "from-pink-500 to-fuchsia-500",
    bgColor: "bg-gradient-to-br from-pink-500 to-fuchsia-500",
  },
  {
    name: "Automotive",
    icon: <Car strokeWidth={1.5} />,
    emoji: "🚗",
    slug: "automotive",
    color: "from-gray-600 to-gray-800",
    bgColor: "bg-gradient-to-br from-gray-600 to-gray-800",
  },
  {
    name: "Education",
    icon: <GraduationCap strokeWidth={1.5} />,
    emoji: "📚",
    slug: "education",
    color: "from-blue-600 to-indigo-500",
    bgColor: "bg-gradient-to-br from-blue-600 to-indigo-500",
  },
  {
    name: "Business",
    icon: <BriefcaseBusiness strokeWidth={1.5} />,
    emoji: "🏢",
    slug: "business",
    color: "from-slate-600 to-slate-800",
    bgColor: "bg-gradient-to-br from-slate-600 to-slate-800",
  },
  {
    name: "Pets",
    icon: <Dog strokeWidth={1.5} />,
    emoji: "🐶",
    slug: "pets",
    color: "from-amber-400 to-yellow-600",
    bgColor: "bg-gradient-to-br from-amber-400 to-yellow-600",
  },
  {
    name: "Fitness",
    icon: <Dumbbell strokeWidth={1.5} />,
    emoji: "💪",
    slug: "fitness",
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
  },
  {
    name: "Clothing",
    icon: <Shirt strokeWidth={1.5} />,
    emoji: "👕",
    slug: "clothing",
    color: "from-indigo-400 to-indigo-600",
    bgColor: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  },
  {
    name: "Gifts",
    icon: <Gift strokeWidth={1.5} />,
    emoji: "🎁",
    slug: "gifts",
    color: "from-red-400 to-pink-600",
    bgColor: "bg-gradient-to-br from-red-400 to-pink-600",
  },
];

interface PopularCategoriesProps {
  visibleCategories?: number;
  className?: string;
  useEmoji?: boolean;
}

export function PopularCategories({
  visibleCategories = 10,
  className,
  useEmoji = true,
}: PopularCategoriesProps) {
  // Use only the first visibleCategories from the list
  const displayCategories = categories.slice(0, visibleCategories);

  return (
    <div className={cn("w-full mb-2", className)}>
      <div className="container mx-auto px-4">
        <div className="relative max-w-6xl mx-auto">
          {/* Scroll indicators */}
          <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-background to-transparent z-10"></div>
          
          <div 
            className="flex overflow-x-auto gap-3 py-2 no-scrollbar relative"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {displayCategories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.slug}`}
                className="group flex-shrink-0 flex items-center gap-2.5 py-2 px-4 hover:bg-muted/40 rounded-lg transition-colors"
              >
                {useEmoji ? (
                  <span className="text-xl flex-shrink-0">{category.emoji}</span>
                ) : (
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                    "text-white transform group-hover:scale-110 transition-all duration-300",
                    category.bgColor
                  )}>
                    {category.icon}
                  </div>
                )}
                
                <span className="font-medium whitespace-nowrap group-hover:text-primary transition-colors text-sm">
                  {category.name}
                </span>
              </Link>
            ))}
            
            {/* Empty element to ensure shadow shows */}
            <div className="flex-shrink-0 w-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 