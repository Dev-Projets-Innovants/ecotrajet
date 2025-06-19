
import { supabase } from '@/integrations/supabase/client';

export const initializeUserChallenges = async (userId: string) => {
  try {
    // Récupérer tous les défis actifs
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true);

    if (challengesError) {
      console.error('Error fetching challenges:', challengesError);
      return;
    }

    if (!challenges || challenges.length === 0) return;

    // Vérifier quels défis l'utilisateur n'a pas encore
    const { data: existingChallenges, error: existingError } = await supabase
      .from('user_challenges')
      .select('challenge_id')
      .eq('user_id', userId);

    if (existingError) {
      console.error('Error fetching existing challenges:', existingError);
      return;
    }

    const existingChallengeIds = existingChallenges?.map(c => c.challenge_id) || [];
    const newChallenges = challenges.filter(c => !existingChallengeIds.includes(c.id));

    if (newChallenges.length === 0) return;

    // Créer les nouveaux défis utilisateur
    const userChallenges = newChallenges.map(challenge => ({
      user_id: userId,
      challenge_id: challenge.id,
      current_value: 0,
      is_completed: false
    }));

    const { error: insertError } = await supabase
      .from('user_challenges')
      .insert(userChallenges);

    if (insertError) {
      console.error('Error inserting user challenges:', insertError);
    } else {
      console.log(`Initialized ${userChallenges.length} challenges for user ${userId}`);
    }
  } catch (error) {
    console.error('Error initializing user challenges:', error);
  }
};

export const grantFirstTripBadge = async (userId: string) => {
  try {
    // Vérifier si l'utilisateur a déjà le badge "Premier Trajet"
    const { data: existingBadge } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_title', 'Premier Trajet')
      .maybeSingle();

    if (existingBadge) return; // Badge déjà obtenu

    // Accorder le badge
    const { error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_title: 'Premier Trajet',
        badge_icon: '🚴‍♂️',
        badge_description: 'Félicitations pour votre premier trajet écologique !'
      });

    if (error) {
      console.error('Error granting first trip badge:', error);
    } else {
      console.log('First trip badge granted to user:', userId);
    }
  } catch (error) {
    console.error('Error granting first trip badge:', error);
  }
};
