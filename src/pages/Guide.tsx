import React, { useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  Leaf, 
  Wrench, 
  MapPin, 
  PlayCircle,
  Play,
  Clock,
  Users,
  Info,
  Award,
  TrendingUp,
  Bike
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { ShareExperienceForm } from '@/components/guide/ShareExperienceForm';

// Mock Tutorial Videos Data
const tutorialVideos = [
  {
    id: 1,
    title: "Comment déverrouiller un Vélib'",
    description: "Apprenez à déverrouiller facilement un vélo Vélib' avec l'application ou le QR code.",
    duration: "2:45",
    views: 1250,
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Planifier son itinéraire écologique",
    description: "Découvrez comment utiliser ÉcoTrajet pour planifier les trajets les plus verts.",
    duration: "4:20",
    views: 980,
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Sécurité à vélo en ville",
    description: "Les règles essentielles pour rouler en sécurité dans les rues de Paris.",
    duration: "3:15",
    views: 2100,
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 4,
    title: "Entretien de base du vélo",
    description: "Maintenez votre vélo en parfait état avec ces conseils d'entretien simples.",
    duration: "5:30",
    views: 750,
    thumbnail: "/api/placeholder/300/200"
  }
];

const Guide = () => {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-eco-light-green to-white py-16">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-sm mb-6">
                <BookOpen className="h-8 w-8 text-eco-green" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Guide ÉcoTrajet</h1>
              <p className="text-lg text-gray-600 max-w-2xl mb-8">
                Découvrez comment maximiser votre expérience ÉcoTrajet et contribuer à un avenir plus vert pour Paris.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="bg-eco-green hover:bg-eco-dark-green text-white"
                  onClick={() => setActiveCategory("tutorials")}
                >
                  Voir les tutoriels
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Grid */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Category 1: Getting Started */}
              <Card 
                className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                  activeCategory === "getting-started" ? "border-eco-green bg-eco-light-green/30" : ""
                }`}
                onClick={() => setActiveCategory("getting-started")}
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-eco-light-green">
                      <BookOpen className="h-5 w-5 text-eco-green" />
                    </div>
                    <CardTitle>Premiers pas</CardTitle>
                  </div>
                  <CardDescription>Apprenez à utiliser ÉcoTrajet</CardDescription>
                </CardHeader>
              </Card>
              
              {/* Category 2: Tutorials */}
              <Card 
                className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                  activeCategory === "tutorials" ? "border-eco-green bg-eco-light-green/30" : ""
                }`}
                onClick={() => setActiveCategory("tutorials")}
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-eco-light-green">
                      <PlayCircle className="h-5 w-5 text-eco-green" />
                    </div>
                    <CardTitle>Tutoriels</CardTitle>
                  </div>
                  <CardDescription>Vidéos explicatives</CardDescription>
                </CardHeader>
              </Card>
              
              {/* Category 3: Safety Tips */}
              <Card 
                className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                  activeCategory === "safety" ? "border-eco-green bg-eco-light-green/30" : ""
                }`}
                onClick={() => setActiveCategory("safety")}
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-eco-light-green">
                      <Shield className="h-5 w-5 text-eco-green" />
                    </div>
                    <CardTitle>Conseils de sécurité</CardTitle>
                  </div>
                  <CardDescription>Restez en sécurité sur la route</CardDescription>
                </CardHeader>
              </Card>
              
              {/* Category 4: Maximize Eco Impact */}
              <Card 
                className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                  activeCategory === "eco-impact" ? "border-eco-green bg-eco-light-green/30" : ""
                }`}
                onClick={() => setActiveCategory("eco-impact")}
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-eco-light-green">
                      <Leaf className="h-5 w-5 text-eco-green" />
                    </div>
                    <CardTitle>Impact écologique</CardTitle>
                  </div>
                  <CardDescription>Maximisez votre empreinte verte</CardDescription>
                </CardHeader>
              </Card>
              
              {/* Category 5: Bike Maintenance */}
              <Card 
                className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                  activeCategory === "maintenance" ? "border-eco-green bg-eco-light-green/30" : ""
                }`}
                onClick={() => setActiveCategory("maintenance")}
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-eco-light-green">
                      <Wrench className="h-5 w-5 text-eco-green" />
                    </div>
                    <CardTitle>Entretien du vélo</CardTitle>
                  </div>
                  <CardDescription>Gardez votre vélo en parfait état</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Content Tabs */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="getting-started" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden md:inline">Premiers pas</span>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="tutorials" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                      <span className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        <span className="hidden md:inline">Tutoriels</span>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="safety" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden md:inline">Sécurité</span>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="eco-impact" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                      <span className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        <span className="hidden md:inline">Impact écologique</span>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="maintenance" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                      <span className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        <span className="hidden md:inline">Entretien</span>
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Getting Started Content */}
                  <TabsContent value="getting-started" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Tutoriel d'utilisation des Vélib'</h2>
                      <p className="text-gray-600 mb-6">
                        Suivez ce guide étape par étape pour commencer à utiliser les Vélib' en toute simplicité.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="rounded-lg bg-eco-light-green p-4 mb-4 flex justify-center">
                              <div className="rounded-full bg-white p-3">
                                <span className="text-xl font-bold text-eco-green">1</span>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Localisez une station</h3>
                            <p className="text-gray-600 text-sm">
                              Utilisez l'application ÉcoTrajet pour trouver la station Vélib' la plus proche de vous.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="rounded-lg bg-eco-light-green p-4 mb-4 flex justify-center">
                              <div className="rounded-full bg-white p-3">
                                <span className="text-xl font-bold text-eco-green">2</span>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Déverrouillez un vélo</h3>
                            <p className="text-gray-600 text-sm">
                              Scannez le QR code sur le vélo ou utilisez votre code personnel pour le déverrouiller.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="rounded-lg bg-eco-light-green p-4 mb-4 flex justify-center">
                              <div className="rounded-full bg-white p-3">
                                <span className="text-xl font-bold text-eco-green">3</span>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Profitez de votre trajet</h3>
                            <p className="text-gray-600 text-sm">
                              Roulez en toute liberté et garez votre vélo dans n'importe quelle station à la fin de votre trajet.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex justify-center mt-8">
                        <Button className="bg-eco-green hover:bg-eco-dark-green text-white" onClick={() => setActiveCategory("tutorials")}>
                          Voir les tutoriels
                          <PlayCircle className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Astuces pour les meilleurs itinéraires</h2>
                      <p className="text-gray-600 mb-6">
                        Des conseils pour trouver les trajets les plus agréables et sécurisés à Paris.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-5 w-5 text-eco-green" />
                              <CardTitle className="text-lg">Pistes cyclables dédiées</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">
                              Privilégiez les itinéraires avec des pistes cyclables dédiées pour plus de sécurité et de confort.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-5 w-5 text-eco-green" />
                              <CardTitle className="text-lg">Évitez les dénivelés importants</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">
                              Planifiez votre trajet pour éviter les montées difficiles, surtout si vous utilisez un vélo standard.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Tutorials Content */}
                  <TabsContent value="tutorials" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Tutoriels vidéo</h2>
                      <p className="text-gray-600 mb-6">
                        Apprenez rapidement avec nos tutoriels vidéo étape par étape.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tutorialVideos.map((video) => (
                          <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                              <div className="h-48 bg-gradient-to-br from-eco-light-green to-eco-green flex items-center justify-center">
                                <div className="bg-white/20 rounded-full p-4">
                                  <Play className="h-8 w-8 text-white" />
                                </div>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2">{video.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {video.views} vues
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {video.duration}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="flex justify-center mt-8">
                        <Button 
                          variant="outline" 
                          className="border-eco-green text-eco-green hover:bg-eco-light-green"
                          onClick={() => setActiveCategory("getting-started")}
                        >
                          Retour aux premiers pas
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Safety Tips Content */}
                  <TabsContent value="safety" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Conseils de sécurité essentiels</h2>
                      <p className="text-gray-600 mb-6">
                        Adoptez ces bonnes pratiques pour rouler en toute sécurité dans Paris.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-5 w-5 text-eco-green" />
                              <CardTitle className="text-lg">Soyez visible</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">
                              Portez des vêtements clairs et réfléchissants, surtout la nuit. Assurez-vous que votre vélo dispose de lumières fonctionnelles.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <Info className="h-5 w-5 text-eco-green" />
                              <CardTitle className="text-lg">Respectez le code</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">
                              Respectez le code de la route, les feux de signalisation et les priorités. Signalez vos intentions aux autres usagers.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <Award className="h-5 w-5 text-eco-green" />
                              <CardTitle className="text-lg">Anticipez</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">
                              Restez attentif à votre environnement, anticipez les actions des autres usagers et gardez une distance de sécurité.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-6 rounded-lg bg-eco-light-green/50 border border-eco-green/20">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          <Info className="h-6 w-6 text-eco-green" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-eco-dark-green mb-2">Équipement recommandé</h3>
                          <p className="text-gray-700 mb-4">
                            Même si le port du casque n'est pas obligatoire, il est fortement recommandé pour votre sécurité.
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Casque de vélo</li>
                            <li>Gilet réfléchissant (obligatoire hors agglomération la nuit)</li>
                            <li>Gants de vélo (surtout en hiver)</li>
                            <li>Lunettes de protection</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Eco Impact Content */}
                  <TabsContent value="eco-impact" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Impact environnemental des transports</h2>
                      <p className="text-gray-600 mb-6">
                        Découvrez comment vos choix de mobilité peuvent contribuer à préserver l'environnement.
                      </p>
                      
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm border mb-8">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-4">Émissions de CO2 par mode de transport</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm flex items-center">
                                  <Bike className="h-4 w-4 mr-2 text-eco-green" />
                                  Vélo
                                </span>
                                <span className="text-sm font-bold text-eco-green">0g CO2/km</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-eco-green h-2 rounded-full" style={{ width: '1%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm">Bus électrique</span>
                                <span className="text-sm font-bold">25g CO2/km</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm">Métro</span>
                                <span className="text-sm font-bold">6g CO2/km</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '5%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm">Bus (diesel)</span>
                                <span className="text-sm font-bold">104g CO2/km</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm">Voiture (essence, seul)</span>
                                <span className="text-sm font-bold">206g CO2/km</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-eco-light-green/30 border-eco-green/20">
                          <CardHeader>
                            <CardTitle>Impact d'un trajet régulier</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4">
                              En utilisant un vélo plutôt qu'une voiture pour un trajet quotidien de 5 km (aller-retour) :
                            </p>
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <Leaf className="h-5 w-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                                <span>Vous économisez environ 2kg de CO2 par jour</span>
                              </li>
                              <li className="flex items-start">
                                <Leaf className="h-5 w-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                                <span>Soit 40kg par mois (20 jours ouvrés)</span>
                              </li>
                              <li className="flex items-start">
                                <Leaf className="h-5 w-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                                <span>Soit 480kg par an</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-eco-light-green/30 border-eco-green/20">
                          <CardHeader>
                            <CardTitle>Équivalent en arbres</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4">
                              Un arbre adulte absorbe environ 25kg de CO2 par an. En utilisant un vélo plutôt qu'une voiture :
                            </p>
                            <div className="flex items-center justify-center p-4">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-eco-green mb-2">≈ 19 arbres</div>
                                <p className="text-sm text-gray-600">
                                  C'est l'équivalent en absorption de CO2 que vous économisez chaque année
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Témoignages d'utilisateurs</h2>
                      <p className="text-gray-600 mb-6">
                        Découvrez comment d'autres utilisateurs contribuent à l'écologie grâce à ÉcoTrajet.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 rounded-full bg-eco-light-green flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="h-6 w-6 text-eco-green" />
                              </div>
                              <div>
                                <h3 className="font-semibold">Sophie, 34 ans</h3>
                                <p className="text-sm text-gray-500 mb-2">Utilisatrice depuis 6 mois</p>
                                <p className="text-gray-600 italic">
                                  "Depuis que j'utilise ÉcoTrajet pour mes déplacements quotidiens, j'ai économisé plus de 250kg de CO2 et je me sens en meilleure forme physique. C'est une victoire sur tous les plans !"
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 rounded-full bg-eco-light-green flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="h-6 w-6 text-eco-green" />
                              </div>
                              <div>
                                <h3 className="font-semibold">Thomas, 28 ans</h3>
                                <p className="text-sm text-gray-500 mb-2">Utilisateur depuis 1 an</p>
                                <p className="text-gray-600 italic">
                                  "Je n'aurais jamais pensé que changer simplement mon mode de transport aurait un tel impact. Grâce à l'application, je vois concrètement ma contribution à l'environnement."
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Bike Maintenance Content */}
                  <TabsContent value="maintenance" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Entretien de base du vélo</h2>
                      <p className="text-gray-600 mb-6">
                        Des conseils simples pour garder votre vélo en parfait état et prolonger sa durée de vie.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <Wrench className="h-5 w-5 text-eco-green" />
                              <CardTitle className="text-lg">Vérification avant départ</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <div className="rounded-full bg-eco-light-green p-1 mr-2 mt-0.5">
                                  <span className="text-xs font-bold text-eco-green">1</span>
                                </div>
                                <span>Vérifiez la pression des pneus (idéalement entre 3.5 et 5 bars)</span>
                              </li>
                              <li className="flex items-start">
                                <div className="rounded-full bg-eco-light-green p-1 mr-2 mt-0.5">
                                  <span className="text-xs font-bold text-eco-green">2</span>
                                </div>
                                <span>Contrôlez l'état et le fonctionnement des freins</span>
                              </li>
                              <li className="flex items-start">
                                <div className="rounded-full bg-eco-light-green p-1 mr-2 mt-0.5">
                                  <span className="text-xs font-bold text-eco-green">3</span>
                                </div>
                                <span>Assurez-vous que la selle est bien fixée et à la bonne hauteur</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <Bike className="h-5 w-5 text-eco-green" />
                              <CardTitle className="text-lg">Entretien régulier</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <div className="rounded-full bg-eco-light-green p-1 mr-2 mt-0.5">
                                  <span className="text-xs font-bold text-eco-green">1</span>
                                </div>
                                <span>Nettoyez votre vélo régulièrement, surtout après une sortie sous la pluie</span>
                              </li>
                              <li className="flex items-start">
                                <div className="rounded-full bg-eco-light-green p-1 mr-2 mt-0.5">
                                  <span className="text-xs font-bold text-eco-green">2</span>
                                </div>
                                <span>Lubrifiez la chaîne une fois par mois ou après nettoyage</span>
                              </li>
                              <li className="flex items-start">
                                <div className="rounded-full bg-eco-light-green p-1 mr-2 mt-0.5">
                                  <span className="text-xs font-bold text-eco-green">3</span>
                                </div>
                                <span>Vérifiez périodiquement le serrage des vis et écrous</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-6 rounded-lg bg-eco-light-green/50 border border-eco-green/20">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
                          <h3 className="text-xl font-semibold text-eco-dark-green mb-2">Problèmes avec un Vélib' ?</h3>
                          <p className="text-gray-700">
                            Si vous rencontrez un problème avec un vélo en libre-service, signalez-le via l'application pour qu'il puisse être réparé rapidement. Vous contribuez ainsi à maintenir le service en bon état pour tous les utilisateurs.
                          </p>
                        </div>
                        <div className="md:w-1/3 flex justify-center md:justify-end">
                          <Button className="bg-eco-green hover:bg-eco-dark-green text-white">
                            Signaler un problème
                          </Button>
                        </div>
                      </div>
                    </div>

                    <ShareExperienceForm />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Guide;
