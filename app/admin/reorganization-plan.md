# Business Module Reorganization Plan

## Current Structure

```
app/
├── add-business/
│   ├── actions.ts
│   └── page.tsx
├── edit-business/
│   ├── [id]/
│   │   └── page.tsx
│   └── actions.ts
├── my-businesses/
│   └── page.tsx
├── business/
│   ├── pages/
│   ├── dashboard/
│   └── ads/
```

## Proposed Structure

```
app/
├── businesses/                  # New parent folder for all business-related functionality
│   ├── add/                     # Add business functionality
│   │   ├── actions.ts
│   │   └── page.tsx
│   ├── edit/                    # Edit business functionality
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── actions.ts
│   ├── my/                      # My businesses functionality
│   │   └── page.tsx
│   ├── [id]/                    # Individual business view
│   │   └── page.tsx
│   ├── actions/                 # Shared business actions
│   │   ├── core.ts              # Core business actions (CRUD operations)
│   │   └── utils.ts             # Utility functions for business actions
│   ├── components/              # Shared business components
│   │   ├── business-card.tsx
│   │   └── business-form.tsx
│   ├── dashboard/               # Business dashboard (moved from business/dashboard)
│   │   └── page.tsx
│   ├── ads/                     # Business ads (moved from business/ads)
│   │   └── page.tsx
│   └── page.tsx                 # Main businesses listing page
```

## Migration Steps

1. Create the new folder structure
2. Move files to their new locations
3. Update imports and references
4. Update routes in links and navigation
5. Test all functionality to ensure it works with the new structure

## Files to Move

1. `app/add-business/actions.ts` → `app/businesses/add/actions.ts`
2. `app/add-business/page.tsx` → `app/businesses/add/page.tsx`
3. `app/edit-business/[id]/page.tsx` → `app/businesses/edit/[id]/page.tsx`
4. `app/edit-business/actions.ts` → `app/businesses/edit/actions.ts`
5. `app/my-businesses/page.tsx` → `app/businesses/my/page.tsx`
6. Move content from `app/business/` to appropriate locations in `app/businesses/`

## Import Updates Required

After moving files, we'll need to update imports in the following ways:

1. Update import paths in all moved files
2. Update references to business-related actions
3. Update navigation links and routes

## Route Changes

The following route changes will be needed:

1. `/add-business` → `/businesses/add`
2. `/edit-business/[id]` → `/businesses/edit/[id]`
3. `/my-businesses` → `/businesses/my`
4. `/business/...` → `/businesses/...`

## Benefits of Reorganization

1. **Improved Organization**: All business-related functionality is in one place
2. **Better Discoverability**: Easier to find business-related code
3. **Clearer Structure**: Logical grouping of related functionality
4. **Easier Maintenance**: Simpler to maintain and extend business features
5. **Consistent Naming**: Uses consistent plural naming convention for resource collections 