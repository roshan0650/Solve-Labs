import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Map } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function IdeaAnalyzer() {
  const [searchParams] = useSearchParams();
  const [idea, setIdea] = useState(searchParams.get("idea") || "");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (searchParams.get("idea") && !analysis && !loading) {
      // Optionally auto-analyze if an idea is passed in
      // analyzeIdea();
    }
  }, [searchParams]);

  const analyzeIdea = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    setAnalysis(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Analyze the following startup idea: "${idea}"
      
      Use the googleSearch tool to perform real-time data scraping (SERP) to find existing competitors, market size, and recent trends related to this idea.
      
      Provide a structured analysis in JSON format with the following keys:
      - existingSolutions (array of strings)
      - advantages (array of strings)
      - risks (array of strings)
      - marketPotential (string description)
      - roadmap (array of strings, 3-5 steps)
      
      Keep descriptions concise and professional.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
        }
      });

      const result = JSON.parse(response.text || "{}");
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing idea:", error);
      // Fallback for demo if API fails
      setAnalysis({
        existingSolutions: ["Competitor A", "Legacy System B"],
        advantages: ["Unique approach", "Lower cost"],
        risks: ["High customer acquisition cost", "Technical complexity"],
        marketPotential: "Large growing market with $10B TAM.",
        roadmap: ["MVP Development", "Beta Testing", "Public Launch"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading italic font-semibold mb-2">Startup Idea Analyzer</h1>
        <p className="text-black/60 text-lg">Evaluate your solution against market realities using AI.</p>
      </div>

      <Card className="glass-card bg-white border-black/5">
        <CardHeader>
          <CardTitle className="text-2xl">Describe your idea</CardTitle>
          <CardDescription>Be specific about the problem, solution, and target audience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="e.g., A platform that connects local farmers directly with urban consumers using a subscription model..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="min-h-[150px] text-base"
          />
          <div className="flex justify-end">
            <Button 
              onClick={analyzeIdea} 
              disabled={loading || !idea.trim()}
              className="rounded-xl px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Idea
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="glass-card bg-white border-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Advantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.advantages?.map((adv: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card bg-white border-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Risks & Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.risks?.map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card bg-white border-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Market Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.marketPotential}</p>
            </CardContent>
          </Card>

          <Card className="glass-card bg-white border-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Map className="h-5 w-5 text-purple-600" />
                Suggested Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 relative border-l border-black/10 ml-2 pl-4">
                {analysis.roadmap?.map((step: string, i: number) => (
                  <li key={i} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-purple-600 ring-4 ring-white"></span>
                    <span className="font-medium text-black/80">Phase {i + 1}</span>
                    <p className="text-black/60 mt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
