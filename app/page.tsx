// import { HeroSection } from "@/components/hero-section"
// import { ProposalsSection } from "@/components/proposals-section"
// import { StatsSection } from "@/components/stats-section"
// import { getHomePageProposals, getDashboardStatistics } from "@/lib/server-api"

// export default async function Home() {
//   // Fetch both proposals and statistics in parallel for better performance
//   const [proposalsData, stats] = await Promise.all([
//     getHomePageProposals(4),
//     getDashboardStatistics()
//   ]);
  
//   const { proposals, totalCount } = proposalsData;

//   return (
//     <div className="flex flex-col min-h-screen">
//       <HeroSection />
//       <StatsSection stats={stats} />
//       <ProposalsSection proposals={proposals} />
//     </div>
//   )
// }

"use client"

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SubmissionStatus = null | 'loading' | 'success' | 'error';

interface FormState {
  email: string;
  status: SubmissionStatus;
  errorMessage: string;
}

export default function ComingSoonPage() {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    status: null,
    errorMessage: ""
  });

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      email: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formState.email || !formState.email.includes('@')) {
      setFormState({
        ...formState,
        status: 'error',
        errorMessage: "Por favor, insira um email válido."
      });
      return;
    }

    setFormState({
      ...formState,
      status: 'loading'
    });

    try {
      // Send to backend API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formState.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao salvar o email.");
      }

      // Success
      setFormState({
        email: "",
        status: 'success',
        errorMessage: ""
      });
    } catch (error) {
      console.error("Error saving email:", error);
      setFormState({
        ...formState,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente mais tarde."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">Veto</span>
            </div>
            <Badge
              variant="outline"
              className="mb-4 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            >
              Nova Versão
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Em Breve</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              O <b>Passos Perdidos</b> agora é <b>Veto</b> para tornar o acompanhamento legislativo mais acessível, intuitivo
              e transparente.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-md border border-blue-100 dark:border-blue-800 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Seja o primeiro a saber</h2>
                <p className="text-muted-foreground mb-6">
                  Deixe o seu email para ser notificado quando lançarmos a nova versão do Veto.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      type="email" 
                      placeholder="Seu email" 
                      className="flex-1" 
                      value={formState.email}
                      onChange={handleEmailChange}
                      disabled={formState.status === 'loading' || formState.status === 'success'}
                    />
                    <Button 
                      type="submit" 
                      disabled={formState.status === 'loading' || formState.status === 'success'}
                    >
                      {formState.status === 'loading' ? 'Enviando...' : 'Notifique-me'}
                    </Button>
                  </div>
                  
                  {formState.status === 'success' && (
                    <Alert className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                      <AlertDescription>
                        Obrigado! Enviaremos uma notificação quando lançarmos.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {formState.status === 'error' && (
                    <Alert className="bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800">
                      <AlertDescription>
                        {formState.errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Interface moderna e intuitiva</h3>
                    <p className="text-sm text-muted-foreground">
                      Design renovado para uma melhor experiência de utilização.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Visualizações interativas</h3>
                    <p className="text-sm text-muted-foreground">
                      Gráficos e visualizações que facilitam a compreensão dos dados.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Filtros avançados</h3>
                    <p className="text-sm text-muted-foreground">Encontre rapidamente a informação que procura.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-bold">Veto</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Veto. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}