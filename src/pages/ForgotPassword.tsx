
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    console.log(data);
    // Ici, vous enverriez normalement un e-mail de réinitialisation
    toast.success("E-mail de réinitialisation envoyé!");
    setEmailSent(true);
  }

  return (
    <AuthLayout
      title="Récupération de mot de passe"
      subtitle="Recevez un lien par e-mail pour réinitialiser votre mot de passe"
    >
      {!emailSent ? (
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

            <Button type="submit" className="w-full">
              Envoyer le lien de réinitialisation
            </Button>
          </form>
        </Form>
      ) : (
        <div className="text-center">
          <div className="mb-6 rounded-full bg-green-50 p-3 inline-flex">
            <div className="rounded-full bg-eco-green p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                <path d="M22 7L13.5 15.5 8.5 10.5 2 17"></path>
                <path d="M16 7 22 7 22 13"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Vérifiez votre boîte mail</h3>
          <p className="text-muted-foreground mb-6">
            Nous avons envoyé un lien de réinitialisation de mot de passe à votre adresse e-mail.
          </p>
          <Button onClick={() => setEmailSent(false)} variant="outline" className="w-full">
            Renvoyer le lien
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/signin" className="inline-flex items-center text-sm text-eco-green hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la connexion
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
