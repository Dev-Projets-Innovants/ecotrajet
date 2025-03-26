
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, MessageSquare, Share2, BookmarkPlus, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";

// Mock Article Data (Replace with actual data fetching)
const articles = [
  {
    id: '1',
    title: "L'impact du vélo sur la réduction de la pollution urbaine",
    content: "Une étude récente menée par l'Institut Parisien de Recherche en Environnement Urbain (IPREU) montre que si 10% des automobilistes parisiens passaient au vélo pour leurs déplacements quotidiens, la pollution de l'air diminuerait de 8% dans la capitale.\n\nCette réduction significative s'explique par le fait que les voitures, même les plus récentes, émettent des particules fines et du dioxyde d'azote en quantité importante, particulièrement lors des courts trajets urbains où le moteur n'a pas le temps d'atteindre sa température optimale.\n\nLes bénéfices d'un transfert modal vers le vélo seraient multiples : amélioration de la qualité de l'air, réduction des émissions de CO2, diminution de la congestion routière et baisse des nuisances sonores.\n\nL'étude souligne également que l'infrastructure cyclable joue un rôle clé dans l'adoption du vélo comme mode de transport principal. Les villes qui investissent dans des pistes cyclables sécurisées et continues voient leur taux d'utilisation du vélo augmenter significativement.",
    author: 'Sophie Dubois',
    date: '2024-01-20',
    readTime: 5,
    tags: ['pollution', 'vélo', 'environnement'],
    imageUrl: 'https://images.unsplash.com/photo-1560337278-ca1c77595377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: '2',
    title: "Les bénéfices du vélo sur la santé physique et mentale",
    content: "Des recherches médicales récentes confirment que 30 minutes de vélo par jour réduisent de 30% les risques de maladies cardiovasculaires et améliorent considérablement la santé mentale.\n\nLe cyclisme régulier renforce le système immunitaire, améliore l'endurance cardiovasculaire et contribue au maintien d'un poids santé. Contrairement à la course à pied, le vélo est un sport à faible impact qui préserve les articulations tout en sollicitant efficacement les muscles des jambes, des fessiers et du tronc.\n\nSur le plan mental, l'exercice physique régulier stimule la production d'endorphines, souvent appelées « hormones du bonheur », qui réduisent naturellement le stress et l'anxiété. De plus, le vélo en extérieur augmente l'exposition à la lumière naturelle, ce qui aide à réguler les cycles de sommeil et à prévenir la dépression saisonnière.\n\nLes médecins recommandent de plus en plus la « prescription de vélo » comme complément thérapeutique pour certains patients souffrant de dépression légère à modérée, d'anxiété ou de troubles du sommeil.",
    author: 'Thomas Lemoine',
    date: '2024-02-15',
    readTime: 7,
    tags: ['santé', 'vélo', 'bien-être'],
    imageUrl: 'https://images.unsplash.com/photo-1547996160-812153910728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: '3',
    title: "L'évolution des pistes cyclables à Paris",
    content: "En 5 ans, Paris a doublé la longueur de ses pistes cyclables, facilitant ainsi la mobilité verte et encourageant plus de citoyens à adopter le vélo comme mode de transport principal.\n\nCe développement rapide s'inscrit dans le plan « Paris Vélo 2026 », qui vise à créer un réseau cyclable complet et sécurisé dans toute la capitale. Les nouvelles pistes cyclables sont plus larges, mieux séparées du trafic automobile et conçues pour répondre aux besoins des cyclistes quotidiens.\n\nL'extension du réseau cyclable a déjà produit des résultats impressionnants : le nombre de déplacements à vélo a augmenté de 54% depuis 2019, et les compteurs vélo installés sur les grands axes enregistrent régulièrement des records de passage.\n\nLes quartiers périphériques, autrefois moins bien desservis, bénéficient désormais d'aménagements cyclables de qualité, ce qui contribue à démocratiser l'usage du vélo dans toute la ville. Les connexions avec les communes limitrophes ont également été améliorées, facilitant les déplacements entre Paris et sa banlieue.",
    author: 'Isabelle Girard',
    date: '2024-03-10',
    readTime: 6,
    tags: ['urbanisme', 'vélo', 'Paris'],
    imageUrl: 'https://images.unsplash.com/photo-1602323048399-9f2264192c9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
];

const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles.find(article => article.id === id);

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
              <p className="text-gray-600">L'article que vous recherchez n'existe pas.</p>
              <Link to="/guide" className="text-eco-green hover:text-eco-dark-green inline-flex items-center mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au Guide
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="text-gray-700 leading-relaxed mb-6">{paragraph}</p>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Link to="/guide" className="inline-flex items-center text-eco-green hover:text-eco-dark-green">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Guide
            </Link>
          </div>

          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img src={article.imageUrl} alt={article.title} className="w-full h-96 object-cover" />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{article.readTime} min de lecture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <BookmarkPlus className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {formatContent(article.content)}

              <div className="border-t pt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Par {article.author}</p>
                  <p className="text-sm text-gray-500">{new Date(article.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-eco-light-green text-eco-green text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <section className="py-12">
            <h2 className="text-2xl font-bold mb-6">Commentaires</h2>
            <div className="space-y-4">
              {/* Mock Comments */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <img className="h-8 w-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1503023345310-154ca5642c81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="User Avatar" />
                </div>
                <div>
                  <div className="text-sm font-medium">Alice Dubois</div>
                  <div className="text-gray-600">Très intéressant, merci pour cet article !</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <img className="h-8 w-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="User Avatar" />
                </div>
                <div>
                  <div className="text-sm font-medium">Pierre Martin</div>
                  <div className="text-gray-600">J'ai partagé cet article avec mes amis, il est très pertinent.</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <img className="h-8 w-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d674x?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="User Avatar" />
                </div>
                <div>
                  <div className="text-sm font-medium">Sophie Bernard</div>
                  <div className="text-gray-600">Votre article m'a beaucoup appris sur la pollution à Paris.</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Laisser un commentaire</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Votre commentaire..."></textarea>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-eco-green hover:bg-eco-dark-green text-white">
                    Envoyer
                    <MessageSquare className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.filter(a => a.id !== id).slice(0, 3).map(relatedArticle => (
                <div key={relatedArticle.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <img src={relatedArticle.imageUrl} alt={relatedArticle.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{relatedArticle.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{relatedArticle.content.split('\n\n')[0]}</p>
                    <Link to={`/guide/article/${relatedArticle.id}`} className="text-eco-green font-medium hover:underline inline-flex items-center mt-2">
                      Lire l'article
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
