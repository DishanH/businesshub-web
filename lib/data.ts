import type { Category, Business, User, BusinessPost, BusinessOwner, Message } from "@/lib/types"

// In-memory storage
const categories: Category[] = []
const businesses: Business[] = []

const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", active: true },
  { id: "2", name: "Jane Smith", email: "jane@example.com", active: true },
  // Add more sample users as needed
]

const businessPosts: BusinessPost[] = []

const businessOwners: BusinessOwner[] = [
  { id: "1", userId: "1", businessId: "1", location: "New York, NY" },
  { id: "2", userId: "2", businessId: "2", location: "Los Angeles, CA" },
  // Add more sample business owners as needed
]

const messages: Message[] = [
  {
    id: "1",
    senderId: "admin",
    receiverId: "1",
    content: "Welcome to our platform!",
    timestamp: new Date(),
    isRead: false,
  },
  {
    id: "2",
    senderId: "1",
    receiverId: "admin",
    content: "Thank you for the welcome message.",
    timestamp: new Date(),
    isRead: true,
  },
  // Add more sample messages as needed
]

// Category operations
export const getCategories = () => categories
export const getActiveCategories = () => categories.filter((c) => c.active)
export const getCategoryById = (id: string) => categories.find((c) => c.id === id)
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)

export const createCategory = (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
  const newCategory: Category = {
    ...category,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  categories.push(newCategory)
  return newCategory
}

export const updateCategory = (id: string, category: Partial<Category>) => {
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return null

  categories[index] = {
    ...categories[index],
    ...category,
    updatedAt: new Date(),
  }
  return categories[index]
}

export const toggleCategoryActive = (id: string) => {
  const category = categories.find((c) => c.id === id)
  if (!category) return null

  category.active = !category.active
  category.updatedAt = new Date()
  return category
}

// Business operations
export const getBusinesses = () => businesses
export const getActiveBusinesses = () => businesses.filter((b) => b.active)
export const getBusinessById = (id: string) => businesses.find((b) => b.id === id)
export const getBusinessesByCategory = (categoryId: string) =>
  businesses.filter((b) => b.categoryId === categoryId && b.active)

export const createBusiness = (business: Omit<Business, "id" | "createdAt" | "updatedAt">) => {
  const newBusiness: Business = {
    ...business,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  businesses.push(newBusiness)
  return newBusiness
}

export const updateBusiness = (id: string, business: Partial<Business>) => {
  const index = businesses.findIndex((b) => b.id === id)
  if (index === -1) return null

  businesses[index] = {
    ...businesses[index],
    ...business,
    updatedAt: new Date(),
  }
  return businesses[index]
}

export const toggleBusinessActive = (id: string) => {
  const business = businesses.find((b) => b.id === id)
  if (!business) return null

  business.active = !business.active
  business.updatedAt = new Date()
  return business
}

export const getUsers = () => users
export const toggleUserActive = (id: string) => {
  const user = users.find((u) => u.id === id)
  if (user) {
    user.active = !user.active
    return user
  }
  return null
}

export const getBusinessPosts = () => businessPosts
export const getBusinessPostById = (id: string) => businessPosts.find((p) => p.id === id)
export const toggleBusinessPostActive = (id: string) => {
  const post = businessPosts.find((p) => p.id === id)
  if (post) {
    post.active = !post.active
    return post
  }
  return null
}

export const createBusinessPost = (post: Omit<BusinessPost, "id" | "createdAt" | "updatedAt">) => {
  const newPost: BusinessPost = {
    ...post,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  businessPosts.push(newPost)
  return newPost
}

export const updateBusinessPost = (id: string, updatedPost: Partial<BusinessPost>) => {
  const index = businessPosts.findIndex((p) => p.id === id)
  if (index !== -1) {
    businessPosts[index] = { ...businessPosts[index], ...updatedPost, updatedAt: new Date() }
    return businessPosts[index]
  }
  return null
}

// Initialize with sample data
createCategory({
  name: "Food & Dining",
  description: "Restaurants, cafes, and other food-related businesses",
  slug: "food-dining",
  subcategories: [
    { id: "rest", name: "Restaurant", description: "Full-service restaurants", active: true },
    { id: "cafe", name: "Cafe", description: "Coffee shops and casual dining", active: true },
    { id: "fast-food", name: "Fast Food", description: "Quick service restaurants", active: true },
  ],
  attributes: [
    {
      name: "Cuisine Type",
      type: "select",
      options: ["Italian", "Chinese", "Indian", "American", "Mexican", "Japanese"],
      required: true,
    },
    {
      name: "Dietary Options",
      type: "multiselect",
      options: ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher"],
      required: false,
    },
    {
      name: "Delivery Available",
      type: "boolean",
      required: false,
    },
  ],
  active: true,
})

createCategory({
  name: "Health & Wellness",
  description: "Fitness centers, spas, and wellness services",
  slug: "health-wellness",
  subcategories: [
    { id: "gym", name: "Gym", description: "Fitness centers and gyms", active: true },
    { id: "spa", name: "Spa", description: "Wellness and relaxation centers", active: true },
    { id: "yoga", name: "Yoga Studio", description: "Yoga and meditation centers", active: true },
  ],
  attributes: [
    {
      name: "Services",
      type: "multiselect",
      options: ["Personal Training", "Group Classes", "Massage", "Nutrition Counseling"],
      required: true,
    },
    {
      name: "Equipment Available",
      type: "boolean",
      required: false,
    },
    {
      name: "Experience Level",
      type: "select",
      options: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      required: true,
    },
  ],
  active: true,
})

createCategory({
  name: "Home Services",
  description: "Professional services for home maintenance and improvement",
  slug: "home-services",
  subcategories: [
    { id: "cleaning", name: "Cleaning", description: "Home cleaning services", active: true },
    { id: "plumbing", name: "Plumbing", description: "Plumbing repair and installation", active: true },
    { id: "electrical", name: "Electrical", description: "Electrical services", active: true },
  ],
  attributes: [
    {
      name: "Service Area",
      type: "multiselect",
      options: ["Downtown", "Suburbs", "Rural"],
      required: true,
    },
    {
      name: "Emergency Service",
      type: "boolean",
      required: false,
    },
    {
      name: "Years of Experience",
      type: "number",
      required: true,
    },
  ],
  active: true,
})

createCategory({
  name: "Professional Services",
  description: "Expert services for businesses and individuals",
  slug: "professional-services",
  subcategories: [
    { id: "legal", name: "Legal", description: "Legal services and consultation", active: true },
    { id: "accounting", name: "Accounting", description: "Accounting and financial services", active: true },
    { id: "consulting", name: "Consulting", description: "Business consulting services", active: true },
  ],
  attributes: [
    {
      name: "Specialization",
      type: "select",
      options: ["Corporate", "Personal", "Tax", "Management"],
      required: true,
    },
    {
      name: "Certifications",
      type: "multiselect",
      options: ["CPA", "Bar Association", "ISO Certified"],
      required: false,
    },
    {
      name: "Consultation Fee",
      type: "number",
      required: true,
    },
  ],
  active: true,
})

createCategory({
  name: "Automotive",
  description: "Services related to vehicles and transportation",
  slug: "automotive",
  subcategories: [
    { id: "repair", name: "Repair", description: "Vehicle repair services", active: true },
    { id: "dealership", name: "Dealership", description: "New and used car dealerships", active: true },
    { id: "rental", name: "Rental", description: "Vehicle rental services", active: true },
  ],
  attributes: [
    {
      name: "Brands Serviced",
      type: "multiselect",
      options: ["Toyota", "Ford", "Honda", "BMW", "Tesla"],
      required: true,
    },
    {
      name: "Service Type",
      type: "select",
      options: ["Mechanical", "Body Work", "Electrical", "Maintenance"],
      required: true,
    },
    {
      name: "Offers Towing",
      type: "boolean",
      required: false,
    },
  ],
  active: true,
})

// Create 20 sample business posts
const sampleBusinessPosts: BusinessPost[] = [
  {
    id: "1",
    title: "Grand Opening: Sweet Delights Bakery",
    content: "Join us for our grand opening celebration! Enjoy special discounts on all our delicious treats.",
    businessName: "Sweet Delights Bakery",
    categoryId: "food-dining",
    subcategoryIds: ["cafe", "bakery"],
    attributes: [
      { attributeId: "Cuisine Type", value: "Desserts" },
      { attributeId: "Dietary Options", value: ["Vegetarian", "Gluten-Free"] },
      { attributeId: "Delivery Available", value: true },
    ],
    address: "123 Main St, Anytown, USA",
    phone: "(555) 123-4567",
    email: "info@sweetdelightsbakery.com",
    website: "https://www.sweetdelightsbakery.com",
    priceRange: 2,
    images: ["/images/sweet-delights-bakery.jpg"],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "New Fitness Classes at FitZone Gym",
    content: "We're excited to announce our new HIIT and yoga fusion classes. Sign up now for a free trial!",
    businessName: "FitZone Gym",
    categoryId: "health-wellness",
    subcategoryIds: ["gym"],
    attributes: [
      { attributeId: "Services", value: ["Personal Training", "Group Classes"] },
      { attributeId: "Equipment Available", value: true },
      { attributeId: "Experience Level", value: "All Levels" },
    ],
    address: "456 Fitness Ave, Healthyville, USA",
    phone: "(555) 987-6543",
    email: "info@fitzonegym.com",
    website: "https://www.fitzonegym.com",
    priceRange: 3,
    images: ["/images/fitzone-gym.jpg"],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Expert Plumbing Services Available 24/7",
    content:
      "Experiencing plumbing issues? Our team of expert plumbers is now available 24/7 for all your emergency needs.",
    businessName: "Quick Fix Plumbing",
    categoryId: "home-services",
    subcategoryIds: ["plumbing"],
    attributes: [
      { attributeId: "Service Area", value: ["Downtown", "Suburbs"] },
      { attributeId: "Emergency Service", value: true },
      { attributeId: "Years of Experience", value: 15 },
    ],
    address: "789 Pipe St, Fixitville, USA",
    phone: "(555) 246-8101",
    email: "service@quickfixplumbing.com",
    website: "https://www.quickfixplumbing.com",
    priceRange: 2,
    images: ["/images/quick-fix-plumbing.jpg"],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... Add 17 more sample business posts here
]

// Add sample business posts to the businessPosts array
businessPosts.push(...sampleBusinessPosts)

export const getBusinessOwners = () => businessOwners
export const getBusinessOwnerById = (id: string) => businessOwners.find((bo) => bo.id === id)
export const getBusinessOwnersByLocation = (location: string) =>
  businessOwners.filter((bo) => bo.location.toLowerCase().includes(location.toLowerCase()))

export const getMessages = () => messages
export const getMessagesBySenderId = (senderId: string) => messages.filter((m) => m.senderId === senderId)
export const getMessagesByReceiverId = (receiverId: string) => messages.filter((m) => m.receiverId === receiverId)

export const createMessage = (message: Omit<Message, "id" | "timestamp">) => {
  const newMessage: Message = {
    ...message,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
  }
  messages.push(newMessage)
  return newMessage
}

