
export interface ContentItem {
  id: string | number;
  type?: 'forum_post' | 'testimonial' | 'photo';
  title: string;
  content?: string;
  author?: string;
  authorId?: number;
  dateSubmitted?: string;
  status?: string;
  [key: string]: any; // Pour permettre d'autres propriétés dynamiques
}
