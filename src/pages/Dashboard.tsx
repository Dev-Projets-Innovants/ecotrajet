
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logique de déconnexion ici
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-eco-green">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-semibold tracking-tight">ÉcoTrajet</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Bienvenue sur votre tableau de bord EcoTrajet!</h1>
          <p className="text-gray-600 mb-6">
            Félicitations! Vous êtes connecté à votre espace personnel.
            <br />
            Cette page sera bientôt améliorée avec plus de fonctionnalités.
          </p>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-eco-light-green mb-4">
            <Leaf className="h-8 w-8 text-eco-green" />
          </div>
          <p className="text-eco-green font-medium">
            Commencez à explorer vos options de mobilité écologique dès maintenant.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
