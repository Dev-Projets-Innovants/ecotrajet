
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Leaf, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AdminSignIn: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    // For demonstration purposes - in a real app you would verify credentials
    // against an authentication service
    console.log('Login attempt with:', data);
    
    // Mock admin credentials check (admin@ecotrajet.fr / admin123)
    if (data.email === 'admin@ecotrajet.fr' && data.password === 'admin123') {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans le panneau d'administration.",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Échec de connexion",
        description: "Email ou mot de passe incorrect.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center text-eco-green mb-2">
            <Leaf className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">ÉcoTrajet</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Panneau d'administration
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-eco-light-green text-eco-green">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@ecotrajet.fr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-eco-green hover:bg-eco-dark-green">
                Se connecter
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Pour la démonstration, utilisez :</p>
            <p className="font-medium">Email: admin@ecotrajet.fr</p>
            <p className="font-medium">Mot de passe: admin123</p>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} EcoTrajet. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default AdminSignIn;
