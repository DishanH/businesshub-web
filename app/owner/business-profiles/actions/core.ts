/**
 * Core Business Actions
 * 
 * This file consolidates all business-related actions from various modules.
 * It serves as a central point for importing business actions throughout the application.
 * 
 * Note: This file does not include the "use server" directive because it only re-exports
 * functions from other files that already have the directive.
 */

// Re-export business actions from their new locations
export { addBusiness } from "../create/actions";
export { updateBusiness } from "../edit/actions";

// Re-export business actions from the businesses.ts file
export { 
  getUserBusinesses, 
  getBusinessById, 
  deleteBusiness, 
  updateBusinessStatus,
  getFeaturedBusinesses,
  getBusinessesByCategory,
  getBusinessesByLocation,
  getNewlyAddedBusinesses,
  revalidateBusinesses,
  searchBusinesses
} from "./businesses"; 