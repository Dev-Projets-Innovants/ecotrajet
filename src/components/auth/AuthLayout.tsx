
import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center space-x-2 text-eco-green">
            <Leaf className="h-6 w-6 transition-transform duration-500 hover:rotate-12" />
            <span className="text-xl font-semibold tracking-tight">ÉcoTrajet</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} EcoTrajet. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
