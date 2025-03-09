# Business Module Migration Plan

This document outlines the plan for migrating the business-related functionality from the old scattered structure to the new consolidated structure under `app/businesses/`.

## Migration Steps

### Phase 1: Initial Setup (Completed)
- [x] Create the new directory structure
- [x] Create the README.md file
- [x] Create the core.ts file to re-export all business-related actions
- [x] Create placeholder functions in businesses.ts

### Phase 2: File Migration (Completed)
- [x] Migrate `app/add-business/actions.ts` → `app/businesses/create/actions.ts`
- [x] Migrate `app/add-business/page.tsx` → `app/businesses/create/page.tsx`
- [x] Migrate `app/edit-business/actions.ts` → `app/businesses/update/actions.ts`
- [x] Migrate `app/edit-business/[id]/page.tsx` → `app/businesses/update/[id]/page.tsx`
- [x] Migrate `app/my-businesses/page.tsx` → `app/businesses/manage/page.tsx`
- [x] Migrate `app/business/dashboard/page.tsx` → `app/account/dashboard/page.tsx`
- [x] Migrate `app/business/ads/page.tsx` → `app/account/ads/page.tsx`
- [ ] Migrate functions from `app/actions/businesses.ts` → `app/businesses/actions/businesses.ts`

### Phase 3: Update Import Paths (In Progress)
- [x] Update import paths in `app/businesses/create/page.tsx`
- [x] Update import paths in `app/businesses/update/[id]/page.tsx`
- [x] Update import paths in `app/businesses/manage/page.tsx`
- [ ] Update import paths in `app/businesses/[id]/page.tsx`
- [ ] Update import paths in `app/businesses/page.tsx`
- [x] Update import paths in `app/account/dashboard/page.tsx`
- [x] Update import paths in `app/account/ads/page.tsx`
- [ ] Update import paths in other files that reference business-related functionality

### Phase 4: Testing
- [ ] Test the `/businesses` route
- [ ] Test the `/businesses/create` route
- [ ] Test the `/businesses/update/[id]` route
- [ ] Test the `/businesses/manage` route
- [ ] Test the `/businesses/[id]` route
- [ ] Test the `/account/dashboard` route
- [ ] Test the `/account/ads` route
- [ ] Test all business-related server actions

### Phase 5: Cleanup (Partially Completed)
- [x] Delete `app/add-business/` directory
- [x] Delete `app/edit-business/` directory
- [x] Delete `app/my-businesses/` directory
- [x] Delete `app/business/` directory
- [x] Delete `app/businesses/add/` directory
- [x] Delete `app/businesses/edit/` directory
- [x] Delete `app/businesses/my/` directory
- [x] Delete `app/businesses/dashboard/` directory
- [x] Delete `app/businesses/ads/` directory
- [ ] Remove business-related functions from `app/actions/businesses.ts`

## Implementation Details

### Updating Import Paths

When updating import paths, follow these patterns:

| Old Import Path | New Import Path |
|-----------------|-----------------|
| `@/app/add-business/actions` | `@/app/businesses/create/actions` |
| `@/app/edit-business/actions` | `@/app/businesses/update/actions` |
| `@/app/actions/businesses` | `@/app/businesses/actions/core` |
| `@/app/businesses/add/actions` | `@/app/businesses/create/actions` |
| `@/app/businesses/edit/actions` | `@/app/businesses/update/actions` |
| `@/app/businesses/my/page` | `@/app/businesses/manage/page` |
| `@/app/businesses/dashboard/page` | `@/app/account/dashboard/page` |
| `@/app/businesses/ads/page` | `@/app/account/ads/page` |

### Testing Strategy

1. Test each route individually to ensure it loads correctly
2. Test form submissions and server actions
3. Test navigation between pages
4. Test error handling

### Rollback Plan

If issues are encountered during the migration, follow these steps:

1. Keep the old files and directories until the migration is complete and tested
2. If a specific route or functionality is broken, revert to using the old files temporarily
3. Document any issues encountered and their solutions

## Timeline

- Phase 1: Completed
- Phase 2: Completed
- Phase 3: In progress
- Phase 4: To be started
- Phase 5: Partially completed

## Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Supabase Documentation](https://supabase.io/docs) 