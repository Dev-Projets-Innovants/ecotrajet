
import { supabase } from '@/integrations/supabase/client';

export interface UserExperience {
  id: string;
  user_id?: string;
  name?: string;
  experience_text: string;
  rating: number;
  image_url?: string;
  is_approved: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExperienceData {
  experience_text: string;
  name?: string;
  rating: number;
  image_url?: string;
  category?: string;
}

export const userExperiencesService = {
  // Create a new experience
  async createExperience(data: CreateExperienceData): Promise<{ data: UserExperience | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const experienceData = {
      ...data,
      user_id: user?.id || null,
      category: data.category || 'bike_maintenance'
    };

    const { data: experience, error } = await supabase
      .from('user_experiences')
      .insert([experienceData])
      .select()
      .single();

    return { data: experience, error };
  },

  // Get approved experiences for public display
  async getApprovedExperiences(): Promise<{ data: UserExperience[] | null; error: any }> {
    const { data, error } = await supabase
      .from('user_experiences')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6); // Limit to 6 most recent for the landing page

    return { data, error };
  },

  // Get user's own experiences
  async getUserExperiences(): Promise<{ data: UserExperience[] | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('user_experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error };
  }
};
