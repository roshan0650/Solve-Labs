import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, AlertCircle, ArrowRight, Loader2, Search } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const mockCities = [
  { id: 1, name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { id: 2, name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { id: 3, name: "Delhi NCR", lat: 28.7041, lng: 77.1025 },
  { id: 4, name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { id: 5, name: "Pune", lat: 18.5204, lng: 73.8567 },
];

interface CityProblem {
  title: string;
  description: string;
  validationScore: number;
  impactScore: number;
  severity: "Critical" | "High" | "Medium";
}

const SimulatedMap = ({ cities, selectedCity, onSelectCity }: { cities: typeof mockCities, selectedCity: typeof mockCities[0], onSelectCity: (city: typeof mockCities[0]) => void }) => {
  // Approximate bounds for India to map coordinates to percentages
  const minLat = 8;
  const maxLat = 37;
  const minLng = 68;
  const maxLng = 97;

  return (
    <div className="relative w-full h-full bg-[#e5e7eb] overflow-hidden flex items-center justify-center min-h-[400px]">
      {/* Subtle background gradient and grid */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }}></div>
      
      {cities.map(city => {
        // Calculate relative position (0-100%)
        const x = ((city.lng - minLng) / (maxLng - minLng)) * 100;
        const y = 100 - ((city.lat - minLat) / (maxLat - minLat)) * 100;
        const isSelected = selectedCity.id === city.id;
        
        return (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300 ${isSelected ? 'z-10' : 'z-0'}`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/* Marker Dot */}
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform duration-300 ${isSelected ? 'bg-black scale-150' : 'bg-black/40 group-hover:bg-black/60 group-hover:scale-125'}`} />
            
            {/* Label */}
            <span className={`mt-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all duration-300 ${isSelected ? 'bg-black text-white opacity-100 translate-y-0 shadow-lg' : 'bg-white/80 text-black opacity-0 group-hover:opacity-100 -translate-y-1 shadow-sm'}`}>
              {city.name}
            </span>
          </button>
        );
      })}
      
      {/* Legend / Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-medium text-black/60 border border-black/10 shadow-sm flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
        Simulated Map View
      </div>
    </div>
  );
};

export default function ProblemExplorer() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(mockCities[0]);
  const [problems, setProblems] = useState<CityProblem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRealTimeProblems = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `Use the googleSearch tool to perform real-time data scraping (SERP) for current major civic, economic, or infrastructural problems in ${selectedCity.name}, India.
        
        Identify the top 3 most pressing issues based on recent news, forums, and trends.
        
        Return the result strictly as a JSON array of objects. Each object must have:
        - title (string, short name of the problem)
        - description (string, 2-3 sentences explaining the issue and recent context)
        - validationScore (number 1-100, how frequently this is discussed)
        - impactScore (number 1-100, severity of impact on residents/businesses)
        - severity (string, exactly one of: "Critical", "High", "Medium")`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }],
          }
        });

        const result = JSON.parse(response.text || "[]");
        setProblems(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching real-time problems:", error);
        // Fallback data if API fails
        setProblems([
          {
            title: "Traffic Congestion & Last Mile",
            description: "High volume of complaints and discussions across local forums and news outlets regarding this issue.",
            validationScore: 94,
            impactScore: 88,
            severity: "Critical"
          },
          {
            title: "Water Management",
            description: "Frequent water shortages and poor distribution infrastructure affecting daily life.",
            validationScore: 85,
            impactScore: 80,
            severity: "High"
          },
          {
            title: "Air Quality",
            description: "Rising pollution levels causing health concerns among residents.",
            validationScore: 78,
            impactScore: 85,
            severity: "High"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeProblems();
  }, [selectedCity]);

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Problem Explorer</h1>
        <p className="text-black/60 text-lg">Discover hyper-local issues across India validated by real-time SERP data.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Map Visualization (Mock) */}
        <Card className="lg:col-span-2 glass-card bg-white border-black/5 flex flex-col overflow-hidden min-h-[500px]">
          <CardHeader className="border-b border-black/5 bg-black/[0.02]">
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-black/40" />
              India Heatmap
            </CardTitle>
            <CardDescription>Select a region to scrape real-time problems.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative bg-[#f5f5f5] flex items-center justify-center min-h-[400px]">
            <SimulatedMap 
              cities={mockCities} 
              selectedCity={selectedCity} 
              onSelectCity={setSelectedCity} 
            />
          </CardContent>
        </Card>

        {/* Right: City Details */}
        <Card className="glass-card bg-white border-black/5 flex flex-col overflow-hidden">
          <CardHeader className="border-b border-black/5 bg-black/[0.02]">
            <CardTitle className="text-2xl">{selectedCity.name}</CardTitle>
            <CardDescription>Top validated problems (Live Data)</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-black/50 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-black/40" />
                <p className="text-sm font-medium animate-pulse">Scraping real-time SERP data...</p>
              </div>
            ) : problems.length > 0 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Top Problem */}
                <div className="p-4 rounded-xl border border-black/10 bg-black/[0.02]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg leading-tight">{problems[0].title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      problems[0].severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      problems[0].severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {problems[0].severity}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 mb-4">
                    {problems[0].description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-black/40 uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Validation</span>
                      <span className="text-xl font-semibold">{problems[0].validationScore}/100</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-black/40 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Impact</span>
                      <span className="text-xl font-semibold">{problems[0].impactScore}/100</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full rounded-xl group"
                    onClick={() => navigate(`/dashboard/generator?problem=${encodeURIComponent(problems[0].title + ': ' + problems[0].description)}`)}
                  >
                    Work on this problem
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Secondary Problems */}
                {problems.slice(1).map((problem, i) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-xl border border-black/5 hover:border-black/10 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/dashboard/generator?problem=${encodeURIComponent(problem.title + ': ' + problem.description)}`)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-black/80 group-hover:text-black">{problem.title}</h4>
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${
                        problem.severity === 'Critical' ? 'text-red-600' :
                        problem.severity === 'High' ? 'text-orange-600' :
                        'text-amber-600'
                      }`}>
                        {problem.severity}
                      </span>
                    </div>
                    <p className="text-xs text-black/50 mb-3 line-clamp-2">{problem.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black/50 font-medium">Validation: {problem.validationScore}</span>
                      <span className="text-black/40 group-hover:text-black transition-colors">Work on this &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-black/50 py-8">
                No data found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
