import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VentureOpportunities() {
  const navigate = useNavigate();

  const opportunities = [
    {
      id: 1,
      problem: "Inefficient Agricultural Supply Chains",
      solutionArea: "AgriTech / Logistics",
      marketPotential: "$15B+",
      companies: ["Ninjacart", "WayCool", "DeHaat"],
      growth: "+24% YoY",
      difficulty: "High"
    },
    {
      id: 2,
      problem: "Lack of Affordable Credit for MSMEs",
      solutionArea: "Fintech / Lending",
      marketPotential: "$50B+",
      companies: ["Lendingkart", "KredX", "OfBusiness"],
      growth: "+18% YoY",
      difficulty: "Medium"
    },
    {
      id: 3,
      problem: "Fragmented Unorganized Retail",
      solutionArea: "B2B E-commerce",
      marketPotential: "$30B+",
      companies: ["Udaan", "Jumbotail", "ShopX"],
      growth: "+32% YoY",
      difficulty: "High"
    },
    {
      id: 4,
      problem: "Poor Access to Quality Healthcare in Tier 2/3",
      solutionArea: "HealthTech / Telemedicine",
      marketPotential: "$10B+",
      companies: ["Practo", "1mg", "Pharmeasy"],
      growth: "+45% YoY",
      difficulty: "Medium"
    }
  ];

  const handleExplore = (problem: string) => {
    navigate(`/dashboard/generator?problem=${encodeURIComponent(problem)}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading italic font-semibold mb-2">Venture Opportunities</h1>
        <p className="text-black/60 text-lg">Curated list of high-potential areas ripe for disruption in India.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <Card key={opp.id} className="glass-card bg-white border-black/5 hover:border-black/10 transition-all group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl leading-tight">{opp.problem}</CardTitle>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  opp.difficulty === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {opp.difficulty} Barrier
                </span>
              </div>
              <CardDescription className="text-sm mt-2 text-black/60 font-medium">
                {opp.solutionArea}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col p-3 rounded-xl bg-black/[0.02] border border-black/5">
                  <span className="text-xs text-black/40 uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Market Size</span>
                  <span className="text-lg font-semibold">{opp.marketPotential}</span>
                </div>
                <div className="flex flex-col p-3 rounded-xl bg-black/[0.02] border border-black/5">
                  <span className="text-xs text-black/40 uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Growth</span>
                  <span className="text-lg font-semibold text-emerald-600">{opp.growth}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-black/40 uppercase tracking-wider block mb-2 flex items-center gap-1"><Users className="h-3 w-3" /> Key Players</span>
                <div className="flex flex-wrap gap-2">
                  {opp.companies.map((company, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-black/5 text-black/70 font-medium">
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full group-hover:bg-black group-hover:text-white transition-colors"
                onClick={() => handleExplore(opp.problem)}
              >
                Explore this space
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
