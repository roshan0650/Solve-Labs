import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Search, Target, Users, Zap, Map, Lightbulb, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black/[0.03] via-transparent to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-sm font-medium mb-8"
        >
          <SparklesIcon className="w-4 h-4" />
          AI-powered innovation platform
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading italic font-semibold tracking-tight max-w-4xl mb-6"
        >
          Start with problems. <br className="hidden md:block" />
          Build real startups.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-black/60 max-w-2xl mb-10"
        >
          SolveLabs discovers real-world problems and helps you turn them into impactful startups. Stop building solutions looking for a problem.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button size="lg" asChild className="group">
            <Link to={user ? "/dashboard" : "/login"}>
              {user ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/dashboard/explorer">Explore Problems</Link>
          </Button>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-black/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading italic font-semibold mb-4">How It Works</h2>
          <p className="text-black/60 max-w-2xl mx-auto">A systematic approach to building meaningful companies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-black/10 -translate-y-1/2 -z-10"></div>
          
          {[
            { icon: Search, title: "Problem Discovery", desc: "AI scans data to find real pain points." },
            { icon: Target, title: "Validation", desc: "Analyze market size and urgency." },
            { icon: Users, title: "Collaboration", desc: "Find co-founders with complementary skills." },
            { icon: Zap, title: "Startup Creation", desc: "Generate ideas and execution plans." }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-6 shadow-md">
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-black/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-black/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading italic font-semibold mb-4">Platform Features</h2>
          <p className="text-black/60 max-w-2xl mx-auto">Everything you need to go from problem to product.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "AI Problem Discovery", desc: "Real-time scraping of forums, news, and data to surface urgent problems." },
            { icon: Map, title: "Problem Explorer", desc: "Interactive map of India showing hyper-local issues and market gaps." },
            { icon: Target, title: "Startup Idea Analyzer", desc: "Evaluate your solutions against existing competitors and market risks." },
            { icon: Lightbulb, title: "Idea Generator", desc: "Stuck? Let our AI propose novel solutions to validated problems." },
            { icon: Users, title: "Team Builder", desc: "Connect with builders, designers, and operators passionate about the same space." },
            { icon: Briefcase, title: "Venture Opportunities", desc: "Curated list of high-potential areas ripe for disruption." }
          ].map((feature, i) => (
            <Card key={i} className="glass-card border-none bg-black/[0.02]">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-white border border-black/10 flex items-center justify-center mb-4 shadow-sm">
                  <feature.icon className="w-5 h-5 text-black" />
                </div>
                <CardTitle className="text-xl not-italic font-sans">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
