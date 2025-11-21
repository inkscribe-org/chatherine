import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import "@/styles/globals.css";
import { LoginForm } from "@/components/ui/login-form";
import { CenteredForm } from "@/components/ui/centered-form";
import { WatsonProbeNavbar } from "@/components/examples/navbar-examples";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div
          className="min-h-screen bg-white font-sans antialiased"
        >
          <WatsonProbeNavbar />

           <section className="relative py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Transform your business with
                    <span className="text-primary"> AI-powered</span> solutions
                  </h1>
                  <div className="flex flex-col sm:flex-row">
                    <Button variant="outline" size="lg">
                      Start Trial
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/form" element={<CenteredForm />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
