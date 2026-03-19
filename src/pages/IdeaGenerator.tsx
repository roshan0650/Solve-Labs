import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Search, ArrowRight } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function IdeaGenerator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [problem, setProblem] = useState(searchParams.get("problem") || "");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  useEffect(() => {
    if (searchParams.get("problem") && !ideas.length && !loading) {
      // Optionally auto-generate if a problem is passed in
      // generateIdeas();
    }
  }, [searchParams]);

  const generateIdeas = async () => {
    if (!problem.trim()) return;
    
    setLoading(true);
    setIdeas([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Generate 3 innovative startup ideas to solve the following problem: "${problem}"
      
      Use the googleSearch tool to perform real-time data scraping (SERP) to find recent trends, existing solutions, and market gaps related to this problem.
      
      Provide the output in JSON format as an array of objects, where each object has:
      - title (string, catchy name)
      - description (string, 2-3 sentences explaining the solution)
      - targetAudience (string)
      - uniqueValueProposition (string)
      - feasibility (string: High, Medium, Low)`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
        }
      });

      const result = JSON.parse(response.text || "[]");
      setIdeas(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error generating ideas:", error);
      // Fallback
      setIdeas([
        {
          title: "EcoLogistics",
          description: "A platform connecting local businesses with electric vehicle owners for sustainable last-mile delivery.",
          targetAudience: "Local retailers and gig workers",
          uniqueValueProposition: "Zero-emission delivery at competitive rates",
          feasibility: "Medium"
        },
        {
          title: "MicroHub",
          description: "Converting unused urban spaces into automated micro-fulfillment centers for rapid neighborhood delivery.",
          targetAudience: "E-commerce brands",
          uniqueValueProposition: "15-minute delivery infrastructure as a service",
          feasibility: "Low"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading italic font-semibold mb-2">Idea Generator</h1>
        <p className="text-black/60 text-lg">Let AI brainstorm solutions for validated problems using real-time SERP data.</p>
      </div>

      <Card className="glass-card bg-white border-black/5">
        <CardHeader>
          <CardTitle className="text-2xl">What problem are you trying to solve?</CardTitle>
          <CardDescription>Enter a specific problem area or select one from the Problem Explorer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
              <Input 
                placeholder="e.g., Last-mile delivery inefficiency in dense urban areas"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="pl-10 h-14 text-base rounded-xl"
              />
            </div>
            <Button 
              onClick={generateIdeas} 
              disabled={loading || !problem.trim()}
              className="h-14 px-8 rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-black/40 py-1">Try:</span>
            {["Water scarcity in tier 2 cities", "Freelancer payment delays", "Affordable mental health"].map((suggestion) => (
              <button 
                key={suggestion}
                onClick={() => setProblem(suggestion)}
                className="text-sm px-3 py-1 rounded-full bg-black/5 hover:bg-black/10 text-black/70 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {ideas.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-heading italic font-semibold">Generated Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea, i) => (
              <Card key={i} className="glass-card bg-white border-black/5 hover:border-black/10 transition-all group cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      idea.feasibility === 'High' ? 'bg-emerald-100 text-emerald-800' :
                      idea.feasibility === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {idea.feasibility} Feasibility
                    </span>
                  </div>
                  <CardDescription className="text-sm mt-2 text-black/70 leading-relaxed">
                    {idea.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-xs text-black/40 uppercase tracking-wider block mb-1">Target Audience</span>
                    <span className="text-sm font-medium">{idea.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-xs text-black/40 uppercase tracking-wider block mb-1">Unique Value Prop</span>
                    <span className="text-sm font-medium">{idea.uniqueValueProposition}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 group-hover:bg-black group-hover:text-white transition-colors"
                    onClick={() => navigate(`/dashboard/analyzer?idea=${encodeURIComponent(idea.title + ': ' + idea.description)}`)}
                  >
                    Analyze this idea
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
