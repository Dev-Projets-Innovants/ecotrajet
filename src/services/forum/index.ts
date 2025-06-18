
import { categoriesService } from './categoriesService';
import { postsService } from './postsService';
import { commentsService } from './commentsService';
import { likesService } from './likesService';
import { reportsService } from './reportsService';

// Re-export types for convenience
export * from './types';

// Main forum service that combines all sub-services
export const forumService = {
  // Categories
  ...categoriesService,
  
  // Posts
  ...postsService,
  
  // Comments
  ...commentsService,
  
  // Likes
  ...likesService,
  
  // Reports
  ...reportsService,
};
