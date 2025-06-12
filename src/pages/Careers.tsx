
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Heart } from 'lucide-react';

const Careers = () => {
  const jobOffers = [
    {
      id: 1,
      title: "Développeur Frontend React",
      type: "CDI",
      location: "Paris",
      description: "Rejoignez notre équipe pour développer l'interface utilisateur de notre application de mobilité verte.",
      skills: ["React", "TypeScript", "Tailwind CSS", "API REST"]
    },
    {
      id: 2,
      title: "Développeur Backend Node.js",
      type: "CDI",
      location: "Paris",
      description: "Concevez et développez les API et services backend de notre plateforme.",
      skills: ["Node.js", "PostgreSQL", "Supabase", "Docker"]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      type: "Freelance",
      location: "Remote",
      description: "Créez des expériences utilisateur exceptionnelles pour promouvoir la mobilité durable.",
      skills: ["Figma", "Design System", "Prototypage", "User Research"]
    }
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6 text-eco-green" />,
      title: "Impact environnemental",
      description: "Contribuez à un avenir plus vert en développant des solutions de mobilité durable."
    },
    {
      icon: <Users className="h-6 w-6 text-eco-green" />,
      title: "Équipe passionnée",
      description: "Rejoignez une équipe unie par la passion de la technologie et de l'environnement."
    },
    {
      icon: <Clock className="h-6 w-6 text-eco-green" />,
      title: "Flexibilité",
      description: "Bénéficiez d'horaires flexibles et de la possibilité de télétravail."
    }
  ];

  return (
    <Layout title="Carrières | ÉcoTrajet">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
          Rejoignez l'aventure ÉcoTrajet
        </h1>
        
        <p className="text-lg text-gray-600 text-center mb-10">
          Participez à la révolution de la mobilité urbaine et contribuez à un avenir plus durable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">Offres d'emploi</h2>
        
        <div className="space-y-6">
          {jobOffers.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="flex items-center mt-2 space-x-4">
                      <Badge variant="secondary">{job.type}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    </CardDescription>
                  </div>
                  <Button className="mt-4 md:mt-0">Postuler</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div>
                  <h4 className="font-medium mb-2">Compétences requises :</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Vous ne trouvez pas l'offre qui vous correspond ?</h3>
              <p className="text-gray-600 mb-6">
                Envoyez-nous votre candidature spontanée ! Nous sommes toujours à la recherche de talents passionnés.
              </p>
              <Button>Candidature spontanée</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
