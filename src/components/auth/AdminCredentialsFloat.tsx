
import React, { useState } from 'react';
import { Shield, X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_CREDENTIALS } from '@/pages/SignIn';
import { toast } from 'sonner';

const AdminCredentialsFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copié dans le presse-papiers`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <>
      {/* Icône flottante */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full bg-eco-green hover:bg-eco-green/90 shadow-lg"
          title="Afficher les identifiants admin"
        >
          <Shield className="h-6 w-6" />
        </Button>
      </div>

      {/* Modal des identifiants */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Shield className="mr-2 h-5 w-5 text-eco-green" />
                Identifiants Admin
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                      {ADMIN_CREDENTIALS.email}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(ADMIN_CREDENTIALS.email, 'Email')}
                    >
                      {copiedField === 'Email' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Mot de passe</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                      {ADMIN_CREDENTIALS.password}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(ADMIN_CREDENTIALS.password, 'Mot de passe')}
                    >
                      {copiedField === 'Mot de passe' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Utilisez ces identifiants pour accéder au panneau d'administration
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AdminCredentialsFloat;
