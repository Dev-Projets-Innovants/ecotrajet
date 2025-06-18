
export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumPost {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_identifier: string | null;
  category_id: string | null;
  title: string;
  content: string;
  image_url: string | null;
  location: string | null;
  tags: string[] | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  is_pinned: boolean;
  is_approved: boolean;
  is_reported: boolean;
  reported_count: number;
  created_at: string;
  updated_at: string;
  forum_categories?: ForumCategory;
}

export interface ForumComment {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_identifier: string | null;
  content: string;
  likes_count: number;
  is_approved: boolean;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumPostLike {
  id: string;
  post_id: string;
  user_id: string | null;
  user_identifier: string | null;
  created_at: string;
}

export interface ForumCommentLike {
  id: string;
  comment_id: string;
  user_id: string | null;
  user_identifier: string | null;
  created_at: string;
}
