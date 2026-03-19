import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, TrendingUp, Star, Activity, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading italic font-semibold mb-2">
          Welcome back{userProfile?.displayName ? `, ${userProfile.displayName.split(' ')[0]}` : ''}.
        </h1>
        <p className="text-black/60 text-lg">Here's what's happening in the innovation space today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Trending Problems", icon: TrendingUp, value: "124", desc: "+12% this week" },
          { title: "Recommended", icon: Star, value: "8", desc: "Based on your skills" },
          { title: "Active Discussions", icon: Activity, value: "32", desc: "In your saved areas" },
          { title: "Personal Impact", icon: Heart, value: "High", desc: "Top 10% of founders" }
        ].map((stat, i) => (
          <Card key={i} className="glass-card bg-white border-black/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium not-italic text-black/60">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-black/40" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading italic">{stat.value}</div>
              <p className="text-xs text-black/50 mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card bg-white border-black/5">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Discoveries</CardTitle>
            <CardDescription>Problems gaining traction in the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Urban Last-Mile Logistics Inefficiency", area: "Supply Chain", score: 92 },
                { title: "Affordable Mental Health Access for Students", area: "Healthcare", score: 88 },
                { title: "Water Scarcity in Tier 2 Cities", area: "Sustainability", score: 85 },
                { title: "Freelancer Payment Delays", area: "Fintech", score: 79 },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:bg-black/[0.02] transition-colors group cursor-pointer"
                  onClick={() => navigate(`/dashboard/generator?problem=${encodeURIComponent(item.title)}`)}
                >
                  <div>
                    <h4 className="font-medium text-black group-hover:underline decoration-black/20 underline-offset-4">{item.title}</h4>
                    <p className="text-sm text-black/50 mt-1">{item.area}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-emerald-600">{item.score}</span>
                      <span className="text-xs text-black/40 uppercase tracking-wider">Impact</span>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-black/20 group-hover:text-black transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-white border-black/5">
          <CardHeader>
            <CardTitle className="text-2xl">Your Activity</CardTitle>
            <CardDescription>Recent interactions and saved items.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { action: "Saved problem", target: "Urban Logistics", time: "2h ago" },
                { action: "Generated ideas for", target: "Mental Health Access", time: "5h ago" },
                { action: "Connected with", target: "Sarah (Designer)", time: "1d ago" },
                { action: "Analyzed startup idea", target: "Fintech for Freelancers", time: "2d ago" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 3 && <div className="absolute left-2 top-6 bottom-[-24px] w-px bg-black/10"></div>}
                  <div className="w-4 h-4 rounded-full bg-black/5 border-2 border-white relative z-10 mt-1"></div>
                  <div>
                    <p className="text-sm text-black/80">
                      <span className="font-medium">{activity.action}</span>{" "}
                      <span className="text-black/60">{activity.target}</span>
                    </p>
                    <p className="text-xs text-black/40 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
