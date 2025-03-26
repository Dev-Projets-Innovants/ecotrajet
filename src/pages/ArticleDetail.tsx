
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Bookmark, Share2, ThumbsUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock article data - in a real app, this would come from an API
const articles = [
  {
    id: '1',
    title: 'Comment les vélos partagés transforment Paris',
    category: 'Impact écologique',
    content: `<p>Les systèmes de vélos en libre-service comme Vélib' ont considérablement transformé le paysage urbain de Paris ces dernières années. Cette révolution de la mobilité douce s'inscrit dans une démarche plus large de transition écologique et de repensée de l'espace urbain.</p>
    
    <h3>Un impact environnemental majeur</h3>
    <p>Chaque trajet effectué en Vélib' plutôt qu'en voiture permet d'économiser en moyenne 200g de CO2. À l'échelle d'une ville comme Paris, avec plus de 100 000 trajets quotidiens, l'impact est considérable : environ 20 tonnes de CO2 économisées chaque jour.</p>
    
    <p>Au-delà de la réduction des émissions de gaz à effet de serre, l'utilisation du vélo contribue également à :</p>
    <ul>
      <li>Réduire la pollution sonore</li>
      <li>Améliorer la qualité de l'air</li>
      <li>Diminuer la congestion urbaine</li>
      <li>Optimiser l'utilisation de l'espace public</li>
    </ul>
    
    <h3>Une transformation de l'espace urbain</h3>
    <p>Le développement des infrastructures cyclables a permis de repenser l'aménagement urbain, avec la création de plus de 1 000 km de pistes cyclables à Paris et dans sa périphérie. Ces aménagements ont contribué à rendre la ville plus agréable et accessible pour tous.</p>
    
    <h3>Un enjeu de santé publique</h3>
    <p>L'utilisation régulière du vélo comme moyen de transport représente également un atout majeur pour la santé publique. Une étude récente a montré qu'un trajet quotidien de 15 minutes permettait de réduire de 40% les risques de maladies cardiovasculaires et de diabète de type 2.</p>
    
    <p>En conclusion, le développement des services comme ÉcoTrajet s'inscrit dans une dynamique positive qui bénéficie tant à l'environnement qu'à la qualité de vie urbaine et à la santé des utilisateurs.</p>`,
    author: 'Marie Dubois',
    date: '15 mai 2023',
    image: 'https://images.unsplash.com/photo-1582628582903-fdb81172394d?q=80&w=1974&auto=format&fit=crop',
    readTime: '5 min',
  },
  {
    id: '2',
    title: 'Guide complet pour maximiser votre impact écologique à vélo',
    category: 'Conseils pratiques',
    content: `<p>Utiliser un vélo comme moyen de transport est déjà un excellent choix pour l'environnement, mais il existe plusieurs façons d'optimiser davantage votre impact positif.</p>
    
    <h3>Optimisez vos trajets</h3>
    <p>La planification intelligente de vos itinéraires peut considérablement réduire votre empreinte carbone :</p>
    <ul>
      <li>Privilégiez les pistes cyclables qui vous permettent de maintenir une vitesse constante, évitant ainsi les arrêts et redémarrages fréquents</li>
      <li>Utilisez l'application ÉcoTrajet pour identifier les itinéraires les plus écologiques</li>
      <li>Combinez vélo et transports en commun pour les longues distances</li>
    </ul>
    
    <h3>Entretenez votre vélo régulièrement</h3>
    <p>Un vélo bien entretenu est plus efficace énergétiquement :</p>
    <ul>
      <li>Vérifiez régulièrement la pression des pneus (une pression optimale réduit la résistance au roulement)</li>
      <li>Maintenez la chaîne propre et lubrifiée</li>
      <li>Assurez-vous que les freins fonctionnent correctement pour éviter le gaspillage d'énergie</li>
    </ul>
    
    <h3>Adoptez une conduite éco-responsable</h3>
    <p>Votre style de conduite influence également votre impact environnemental :</p>
    <ul>
      <li>Maintenez une cadence régulière plutôt que de faire des sprints suivis de périodes de roue libre</li>
      <li>Anticipez les obstacles et les feux pour éviter les freinages brusques</li>
      <li>Utilisez le changement de vitesse de manière optimale pour maintenir un effort constant</li>
    </ul>
    
    <h3>Prolongez la durée de vie de votre équipement</h3>
    <p>La durabilité est un aspect essentiel de l'éco-responsabilité :</p>
    <ul>
      <li>Protégez votre vélo des intempéries pour éviter l'usure prématurée</li>
      <li>Réparez plutôt que de remplacer lorsque c'est possible</li>
      <li>Choisissez des accessoires durables et de qualité</li>
    </ul>
    
    <p>En suivant ces conseils, vous maximiserez l'impact positif de votre pratique du vélo sur l'environnement, tout en améliorant votre expérience quotidienne de cycliste urbain.</p>`,
    author: 'Thomas Martin',
    date: '3 juin 2023',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1970&auto=format&fit=crop',
    readTime: '7 min',
  },
  {
    id: '3',
    title: 'Les avantages cachés du vélo en ville',
    category: 'Santé et bien-être',
    content: `<p>Au-delà des bénéfices évidents pour l'environnement, la pratique régulière du vélo en milieu urbain offre de nombreux avantages souvent méconnus.</p>
    
    <h3>Un boost pour votre santé mentale</h3>
    <p>Contrairement aux transports en commun bondés ou aux embouteillages stressants, le vélo permet de :</p>
    <ul>
      <li>Réduire significativement le niveau de stress quotidien</li>
      <li>Améliorer la qualité du sommeil grâce à l'activité physique modérée</li>
      <li>Stimuler la production d'endorphines, les hormones du bien-être</li>
      <li>Offrir un moment de déconnexion et de pleine conscience</li>
    </ul>
    
    <h3>Un gain financier considérable</h3>
    <p>L'aspect économique du vélo est souvent sous-estimé :</p>
    <ul>
      <li>Économies sur les frais de transports en commun ou de carburant</li>
      <li>Réduction des coûts de stationnement</li>
      <li>Diminution des dépenses de santé grâce à une meilleure condition physique</li>
      <li>Entretien minimal comparé à une voiture</li>
    </ul>
    
    <h3>Une redécouverte de votre ville</h3>
    <p>Le vélo permet une expérience urbaine unique :</p>
    <ul>
      <li>Découverte de quartiers et ruelles inaccessibles en voiture</li>
      <li>Possibilité de s'arrêter spontanément pour explorer</li>
      <li>Connexion plus directe avec l'environnement urbain</li>
      <li>Rencontres et interactions sociales facilitées</li>
    </ul>
    
    <h3>Une ponctualité améliorée</h3>
    <p>Contrairement aux idées reçues :</p>
    <ul>
      <li>Temps de trajet plus prévisible, non soumis aux aléas de la circulation ou des retards de transports</li>
      <li>Possibilité d'emprunter des raccourcis inaccessibles aux voitures</li>
      <li>Stationnement facilité et plus rapide</li>
    </ul>
    
    <p>Ces bénéfices cachés font du vélo bien plus qu'un simple moyen de transport écologique : c'est un véritable art de vivre urbain qui transforme positivement votre quotidien à de multiples niveaux.</p>`,
    author: 'Sophie Legrand',
    date: '21 juillet 2023',
    image: 'https://images.unsplash.com/photo-1571331628722-1787080d97f4?q=80&w=1974&auto=format&fit=crop',
    readTime: '6 min',
  },
];

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the article that matches the id from the URL
  const article = articles.find(article => article.id === id);
  
  // If article not found, show a message
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article non trouvé</h2>
            <p className="mb-6">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
            <Link to="/guide">
              <Button className="bg-eco-green hover:bg-eco-dark-green">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au Guide
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Link to="/guide" className="inline-flex items-center text-eco-green hover:text-eco-dark-green mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Guide
          </Link>
          
          <article className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6">
                  <span className="inline-block bg-eco-green text-white px-3 py-1 text-sm font-semibold rounded-full mb-2">
                    {article.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{article.title}</h1>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <div className="flex items-center mr-4">
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </div>
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {article.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.readTime} de lecture
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </ScrollArea>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    J'aime
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Sauvegarder
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  Partager
                </Button>
              </div>
            </div>
          </article>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Articles connexes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(a => a.id !== id)
                .slice(0, 3)
                .map(relatedArticle => (
                  <Link key={relatedArticle.id} to={`/guide/article/${relatedArticle.id}`} className="block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      <img 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title} 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <span className="text-xs font-semibold text-eco-green">{relatedArticle.category}</span>
                        <h4 className="font-medium mt-1 line-clamp-2">{relatedArticle.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
