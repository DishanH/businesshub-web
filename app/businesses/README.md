# Businesses Module

This directory contains all business-related functionality for the application.

## Directory Structure

```
app/businesses/
├── actions/                  # Shared business actions
│   ├── core.ts              # Core business actions (CRUD operations)
│   ├── businesses.ts        # Business-related server actions
│   └── utils.ts             # Utility functions for business actions
├── create/                   # Create business functionality
│   ├── actions.ts           # Add business server action
│   └── page.tsx             # Create business page component
├── update/                   # Update business functionality
│   ├── [id]/                # Dynamic route for updating a specific business
│   │   └── page.tsx         # Update business page component
│   └── actions.ts           # Update business server action
├── manage/                   # Manage businesses functionality
│   └── page.tsx             # Manage businesses page component
├── [id]/                    # Dynamic route for viewing a specific business
│   └── page.tsx             # Business details page component
├── components/              # Shared business components
└── page.tsx                 # Main businesses listing page
```

## Routing Structure

- `/businesses` - Main businesses listing page
- `/businesses/create` - Create a new business
- `/businesses/update/[id]` - Update an existing business
- `/businesses/manage` - Manage your businesses
- `/businesses/[id]` - View a specific business
- `/account/dashboard` - Business dashboard
- `/account/ads` - Business ads

## Server Actions

All business-related server actions are consolidated in the `actions/core.ts` file, which re-exports them from their respective locations:

- `addBusiness` - Add a new business (from `create/actions.ts`)
- `updateBusiness` - Update an existing business (from `update/actions.ts`)
- `getUserBusinesses` - Get businesses for a specific user (from `actions/businesses.ts`)
- `getBusinessById` - Get a specific business by ID (from `actions/businesses.ts`)
- `deleteBusiness` - Delete a business (from `actions/businesses.ts`)
- `updateBusinessStatus` - Update a business's active status (from `actions/businesses.ts`)
- `getFeaturedBusinesses` - Get featured businesses (from `actions/businesses.ts`)
- `getBusinessesByCategory` - Get businesses by category (from `actions/businesses.ts`)
- `getBusinessesByLocation` - Get businesses by location (from `actions/businesses.ts`)
- `getNewlyAddedBusinesses` - Get newly added businesses (from `actions/businesses.ts`)
- `revalidateBusinesses` - Revalidate businesses cache (from `actions/businesses.ts`)

## Migration Status

The migration from the old structure to the new structure is in progress. Here's the current status:

### Completed
- Created the new directory structure
- Migrated the following files:
  - `app/add-business/actions.ts` → `app/businesses/create/actions.ts`
  - `app/add-business/page.tsx` → `app/businesses/create/page.tsx`
  - `app/edit-business/actions.ts` → `app/businesses/update/actions.ts`
  - `app/edit-business/[id]/page.tsx` → `app/businesses/update/[id]/page.tsx`
  - `app/my-businesses/page.tsx` → `app/businesses/manage/page.tsx`
  - `app/business/dashboard/page.tsx` → `app/account/dashboard/page.tsx`
  - `app/business/ads/page.tsx` → `app/account/ads/page.tsx`
- Created the core.ts file to re-export all business-related actions
- Created placeholder functions in businesses.ts
- Removed old directories

### In Progress
- Migrating the full implementation of business-related functions from `app/actions/businesses.ts` to `app/businesses/actions/businesses.ts`
- Updating import paths in all files to use the new structure

### Next Steps
1. Complete the migration of all functions from `app/actions/businesses.ts`
2. Update all import paths throughout the application to use the new structure
3. Test all routes and functionality
4. Remove business-related functions from `app/actions/businesses.ts`

## Usage

To use the business-related functionality in your code, import the actions from the core.ts file:

```typescript
import { 
  addBusiness, 
  updateBusiness, 
  getUserBusinesses,
  // etc.
} from "@/app/businesses/actions/core"
```

This ensures that you're always using the most up-to-date implementation of these functions. 