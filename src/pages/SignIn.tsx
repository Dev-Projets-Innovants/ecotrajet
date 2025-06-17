
import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";

const signInSchema = z.object({
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide" }),
  password: z.string().min(1, { message: "Veuillez saisir votre mot de passe" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

// Admin credentials constant to easily manage and remember
export const ADMIN_CREDENTIALS = {
  email: "admin@ecotrajet.com",
  password: "Admin123!"
};

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  // Check if there's a redirect path in the location state
  const from = location.state?.from || "/dashboard";

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    console.log('=== SIGNIN DEBUG ===');
    console.log('Attempting to sign in with:', data.email);
    console.log('Redirect destination:', from);
    
    try {
      const { data: authData, error } = await signIn(data.email, data.password);
      
      console.log('Auth response:', { authData, error });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message || "Erreur lors de la connexion");
        return;
      }

      if (authData?.user) {
        console.log('User authenticated successfully:', authData.user);
        
        // Check if the user is an admin
        const isAdmin = data.email === ADMIN_CREDENTIALS.email;
        console.log('Is admin?', isAdmin);
        
        if (isAdmin) {
          console.log('Redirecting to admin dashboard...');
          toast.success("Connexion administrateur réussie!");
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        } else {
          console.log('Redirecting to user dashboard...', from);
          toast.success("Connexion réussie!");
          setTimeout(() => {
            navigate(from);
          }, 1000);
        }
      } else {
        console.error('No user data received despite successful auth');
        toast.error("Erreur: aucune donnée utilisateur reçue");
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error("Une erreur inattendue s'est produite");
    }
  }

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Connectez-vous à votre compte EcoTrajet"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="votre@email.com" {...field} />
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
                <div className="flex items-center justify-between">
                  <FormLabel>Mot de passe</FormLabel>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-eco-green hover:underline"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Connexion..." : "Se connecter"} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>

      <p className="text-center mt-6 text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/signup" className="text-eco-green hover:underline font-medium">
          S'inscrire
        </Link>
      </p>
      
      {/* Admin login hint - can be removed in production */}
      <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-center">
        <p className="font-medium text-gray-500 dark:text-gray-400">Pour accéder au panneau admin:</p>
        <p className="text-gray-500 dark:text-gray-400">Email: {ADMIN_CREDENTIALS.email}</p>
        <p className="text-gray-500 dark:text-gray-400">Mot de passe: {ADMIN_CREDENTIALS.password}</p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
