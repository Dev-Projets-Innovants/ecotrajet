
import { supabase } from '@/integrations/supabase/client';

export const categoriesService = {
  async getCategories() {
    return await supabase
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
  },
};
