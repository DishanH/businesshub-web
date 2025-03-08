# Server Actions Organization

This document explains the organization of server actions in the BusinessHub application.

## Structure

The server actions are organized as follows:

1. **Global Actions**: Located in the `app/actions/` directory
   - `businesses.ts`: Actions for fetching and managing businesses
   - `categories.ts`: Actions for fetching categories and subcategories
   - Other global actions that are used across multiple pages

2. **Page-Specific Actions**: Located in the respective page directories
   - `app/add-business/actions.ts`: Actions specific to the add business page
   - `app/auth/sign-in/actions.ts`: Authentication actions for sign-in
   - `app/auth/sign-up/actions.ts`: Authentication actions for sign-up
   - `app/admin/actions.ts`: Admin-specific actions
   - `app/admin/categories/actions.ts`: Category management actions
   - `app/admin/users/actions.ts`: User management actions
   - `app/account/actions.ts`: User account management actions

## Completed Changes

We've made the following changes to improve organization:

1. **Moved `addBusiness` Action**:
   - Moved from `app/actions/add-business.ts` to `app/add-business/actions.ts`
   - Updated imports in `app/add-business/page.tsx`
   - Deleted the old `app/actions/add-business.ts` file

2. **Fixed Column Name Issue**:
   - Changed `image_url` to `url` in all queries to match the database schema
   - Added `alt_text` field to image data

3. **Improved Code Organization**:
   - Added clear section headers in `businesses.ts` and `categories.ts`
   - Added comprehensive JSDoc comments to all functions
   - Grouped related functions together

## Best Practices

When working with server actions:

1. **Location**:
   - Place global actions in `app/actions/`
   - Place page-specific actions in the respective page directory

2. **Naming**:
   - Use descriptive function names that indicate what the action does
   - Use consistent naming patterns (e.g., `getX`, `updateX`, `deleteX`)

3. **Documentation**:
   - Add JSDoc comments to all exported functions
   - Include parameter descriptions and return type information
   - Use section headers to organize related functions

4. **Error Handling**:
   - Always include proper error handling
   - Return consistent response objects with `success` and `error` properties
   - Log errors with appropriate context

5. **Revalidation**:
   - Call `revalidatePath()` when data changes to update the UI
   - Revalidate all relevant paths that display the changed data

## Example

```typescript
/**
 * Get a single business by ID
 * 
 * @param businessId - Business ID to fetch
 * @returns Object with success status and data or error details
 */
export async function getBusinessById(businessId: string) {
  try {
    // Implementation...
    return { success: true, data };
  } catch (error) {
    console.error("Error in getBusinessById:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
} 