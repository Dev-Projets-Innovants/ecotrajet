
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

export interface UpdateExperienceData {
  experience_text?: string;
  name?: string;
  rating?: number;
  image_url?: string;
  category?: string;
  is_approved?: boolean;
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
  },

  // Admin functions
  // Get all experiences (for admin)
  async getAllExperiences(): Promise<{ data: UserExperience[] | null; error: any }> {
    const { data, error } = await supabase
      .from('user_experiences')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Get experiences by status (for admin)
  async getExperiencesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<{ data: UserExperience[] | null; error: any }> {
    let isApproved: boolean | null = null;
    
    if (status === 'approved') isApproved = true;
    if (status === 'rejected') isApproved = false;
    
    const query = supabase
      .from('user_experiences')
      .select('*')
      .order('created_at', { ascending: false });

    if (isApproved !== null) {
      query.eq('is_approved', isApproved);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Update experience (for admin)
  async updateExperience(id: string, data: UpdateExperienceData): Promise<{ data: UserExperience | null; error: any }> {
    const { data: experience, error } = await supabase
      .from('user_experiences')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    return { data: experience, error };
  },

  // Approve experience (for admin)
  async approveExperience(id: string): Promise<{ data: UserExperience | null; error: any }> {
    return this.updateExperience(id, { is_approved: true });
  },

  // Reject experience (for admin)
  async rejectExperience(id: string): Promise<{ data: UserExperience | null; error: any }> {
    return this.updateExperience(id, { is_approved: false });
  },

  // Delete experience (for admin)
  async deleteExperience(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_experiences')
      .delete()
      .eq('id', id);

    return { error };
  }
};
