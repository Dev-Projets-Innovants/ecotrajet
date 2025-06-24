import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    
    switch (action) {
      case 'forum-recommendations':
        return await getForumRecommendations(params);
      case 'personalized-guide':
        return await getPersonalizedGuide(params);
      default:
        throw new Error('Action non supportée');
    }
  } catch (error) {
    console.error('Erreur Gemini Recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getForumRecommendations({ userId, limit = 5 }) {
  console.log('Génération de recommandations forum pour utilisateur:', userId);

  try {
    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Récupérer les posts existants avec leurs catégories
    const { data: posts } = await supabase
      .from('forum_posts')
      .select(`
        id, title, content, tags, location, created_at,
        forum_categories (name, color)
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(50);

    // Récupérer l'historique des interactions utilisateur
    const { data: likedPosts } = await supabase
      .from('forum_post_likes')
      .select('post_id')
      .eq('user_id', userId);

    const likedPostIds = likedPosts?.map(like => like.post_id) || [];

    // Préparer le prompt pour Gemini
    const userContext = {
      profile: profile ? {
        city: profile.city || 'Paris',
        bio: profile.bio || '',
        interests: profile.preferences || {}
      } : { city: 'Paris', bio: '', interests: {} },
      likedPosts: likedPostIds.length
    };

    const postsContext = posts?.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content.substring(0, 200),
      category: post.forum_categories?.name || 'Général',
      tags: post.tags || [],
      location: post.location || '',
      isLiked: likedPostIds.includes(post.id)
    }));

    const prompt = `
Tu es un système de recommandation intelligent pour une plateforme d'éco-mobilité.

PROFIL UTILISATEUR:
- Ville: ${userContext.profile.city}
- Bio: ${userContext.profile.bio}
- Posts likés: ${userContext.likedPosts}

POSTS DISPONIBLES:
${JSON.stringify(postsContext, null, 2)}

MISSION:
Recommande ${limit} posts les plus pertinents pour cet utilisateur en fonction de:
1. Sa localisation géographique
2. Ses intérêts (déduits de sa bio et historique)
3. La diversité des catégories
4. La fraîcheur du contenu

RÉPONSE ATTENDUE (JSON uniquement, sans formatage markdown):
{
  "recommendations": [
    {
      "postId": "uuid",
      "score": 0.95,
      "reason": "Raison spécifique de la recommandation"
    }
  ]
}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API Gemini: ${response.status}`);
    }

    const data = await response.json();
    console.log('Réponse Gemini brute:', JSON.stringify(data, null, 2));
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error('Contenu manquant dans la réponse Gemini');
      // Retourner des recommandations par défaut si Gemini échoue
      return new Response(
        JSON.stringify({ recommendations: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contenu Gemini:', content);

    // Nettoyer le contenu et extraire le JSON
    let cleanContent = content.trim();
    
    // Supprimer les balises markdown si présentes
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Trouver le JSON dans la réponse
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Aucun JSON trouvé dans la réponse:', cleanContent);
      return new Response(
        JSON.stringify({ recommendations: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let recommendations;
    try {
      recommendations = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError, 'Contenu:', jsonMatch[0]);
      return new Response(
        JSON.stringify({ recommendations: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Enrichir avec les données complètes des posts
    const enrichedRecommendations = recommendations.recommendations?.map(rec => {
      const post = posts?.find(p => p.id === rec.postId);
      return {
        ...rec,
        post: post || null
      };
    }).filter(rec => rec.post) || [];

    console.log('Recommandations générées:', enrichedRecommendations.length);

    return new Response(
      JSON.stringify({ recommendations: enrichedRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur API Gemini:', error);
    return new Response(
      JSON.stringify({ recommendations: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getPersonalizedGuide({ userId, section = 'premiers-pas' }) {
  console.log('Génération guide personnalisé pour utilisateur:', userId, 'section:', section);

  if (!GEMINI_API_KEY) {
    console.error('Clé API Gemini manquante');
    return new Response(
      JSON.stringify({ 
        error: 'Configuration manquante',
        guide: getDefaultGuide(section) 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Récupérer quelques statistiques utilisateur si disponibles
    const { data: stats } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Préparer le contexte utilisateur
    const userContext = {
      profile: profile ? {
        city: profile.city || 'Paris',
        bio: profile.bio || '',
        createdAt: profile.created_at
      } : { city: 'Paris', bio: '', createdAt: new Date().toISOString() },
      stats: stats || {},
      isNewUser: !stats || Object.keys(stats).length === 0
    };

    const prompt = `
Tu es un guide personnalisé pour ÉcoTrajet, une plateforme d'éco-mobilité.

PROFIL UTILISATEUR:
- Ville: ${userContext.profile.city}
- Bio: ${userContext.profile.bio}
- Nouveau utilisateur: ${userContext.isNewUser ? 'Oui' : 'Non'}
- Membre depuis: ${userContext.profile.createdAt}

SECTION DEMANDÉE: ${section}

MISSION:
Génère un guide personnalisé et engageant pour la section "${section}" en tenant compte:
1. Du niveau d'expérience de l'utilisateur
2. De sa localisation (conseils spécifiques à sa ville)
3. De son profil et centres d'intérêt
4. Des meilleures pratiques d'éco-mobilité

RÉPONSE ATTENDUE (JSON uniquement, sans formatage markdown):
{
  "guide": {
    "title": "Titre personnalisé pour ${userContext.profile.city}",
    "introduction": "Introduction engageante et personnalisée",
    "steps": [
      {
        "id": 1,
        "title": "Première étape adaptée",
        "content": "Contenu détaillé et personnalisé",
        "tips": ["Conseil pratique 1", "Conseil pratique 2"],
        "citySpecific": "Conseil spécifique à ${userContext.profile.city}"
      },
      {
        "id": 2,
        "title": "Deuxième étape progressive",
        "content": "Contenu qui s'appuie sur l'étape précédente",
        "tips": ["Conseil avancé 1", "Conseil avancé 2"],
        "citySpecific": "Information locale pour ${userContext.profile.city}"
      },
      {
        "id": 3,
        "title": "Étape d'approfondissement",
        "content": "Contenu pour aller plus loin",
        "tips": ["Conseil expert 1", "Conseil expert 2"],
        "citySpecific": "Ressource locale spécifique"
      }
    ],
    "nextSteps": "Suggestions personnalisées pour continuer le parcours",
    "personalizedMessage": "Message motivant personnalisé pour cet utilisateur"
  }
}

Rends le guide vraiment personnalisé selon le profil de l'utilisateur.
`;

    console.log('Appel API Gemini avec clé:', GEMINI_API_KEY ? 'Présente' : 'Manquante');

    // Utiliser la bonne URL de l'API Gemini Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        }
      }),
    });

    console.log('Statut réponse Gemini:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API Gemini ${response.status}:`, errorText);
      throw new Error(`Erreur API Gemini: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Réponse Gemini reçue, candidates:', data.candidates?.length || 0);
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error('Contenu manquant dans la réponse Gemini');
      return new Response(
        JSON.stringify({ guide: getDefaultGuide(section) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contenu Gemini reçu:', content.substring(0, 200) + '...');

    // Nettoyer le contenu et extraire le JSON
    let cleanContent = content.trim();
    
    // Supprimer les balises markdown si présentes
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Trouver le JSON dans la réponse
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Aucun JSON trouvé dans la réponse:', cleanContent.substring(0, 500));
      return new Response(
        JSON.stringify({ guide: getDefaultGuide(section) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let guide;
    try {
      guide = JSON.parse(jsonMatch[0]);
      console.log('Guide parsé avec succès:', guide.guide?.title || 'Titre manquant');
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError, 'Contenu:', jsonMatch[0].substring(0, 500));
      return new Response(
        JSON.stringify({ guide: getDefaultGuide(section) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Guide personnalisé généré avec succès pour section:', section);

    return new Response(
      JSON.stringify(guide),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur génération guide:', error);
    
    return new Response(
      JSON.stringify({ guide: getDefaultGuide(section) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

function getDefaultGuide(section: string) {
  return {
    title: "Guide ÉcoTrajet - Premiers pas",
    introduction: "Nous rencontrons actuellement des difficultés techniques avec la personnalisation. Voici un guide général pour commencer :",
    steps: [
      {
        id: 1,
        title: "Évaluez vos trajets actuels",
        content: "Analysez vos déplacements quotidiens pour identifier les opportunités d'amélioration écologique.",
        tips: ["Notez vos trajets récurrents", "Calculez les distances parcourues"],
        citySpecific: "Explorez les options de transport disponibles dans votre ville"
      },
      {
        id: 2,
        title: "Découvrez les alternatives",
        content: "Explorez les différents modes de transport écologiques disponibles.",
        tips: ["Testez le vélo pour les courtes distances", "Utilisez les transports en commun"],
        citySpecific: "Renseignez-vous sur les infrastructures locales"
      }
    ],
    nextSteps: "Une fois les problèmes techniques résolus, vous pourrez accéder à un guide entièrement personnalisé.",
    personalizedMessage: "Votre engagement pour l'éco-mobilité fait la différence !"
  };
}
