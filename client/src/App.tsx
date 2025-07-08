import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Doctor from "@/pages/Doctor";
import Booking from "@/pages/Booking";
import Confirmation from "@/pages/Confirmation";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/doctor" component={Doctor} />
      <Route path="/booking" component={Booking} />
      <Route path="/confirmation/:id" component={Confirmation} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-dark-charcoal flex flex-col relative">
          {/* Global Video Background */}
          <div className="fixed inset-0 z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-10"
              style={{ filter: 'brightness(0.3)' }}
            >
              <source src="/attached_assets/20250708_1235_Surreal Floating Teeth_simple_compose_01jzmjtaxje1xrch7sj4tcvrjh_1751968458677.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-dark-charcoal bg-opacity-90" />
          </div>
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
