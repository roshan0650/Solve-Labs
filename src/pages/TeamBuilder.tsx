import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, Code, Palette, Megaphone } from "lucide-react";
import { toast } from "sonner";

export default function TeamBuilder() {
  const profiles = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Product Designer",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
      skills: ["UI/UX", "Figma", "User Research"],
      interests: ["EdTech", "Sustainability"],
      icon: Palette
    },
    {
      id: 2,
      name: "David Chen",
      role: "Full Stack Engineer",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David",
      skills: ["React", "Node.js", "PostgreSQL"],
      interests: ["Fintech", "Web3"],
      icon: Code
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Growth Marketer",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya",
      skills: ["SEO", "Performance Marketing", "Content"],
      interests: ["D2C", "HealthTech"],
      icon: Megaphone
    },
    {
      id: 4,
      name: "Michael Ross",
      role: "Operations Lead",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael",
      skills: ["Supply Chain", "Logistics", "Process Optimization"],
      interests: ["AgriTech", "B2B SaaS"],
      icon: Briefcase
    }
  ];

  const handleConnect = (name: string) => {
    toast.success(`Connection request sent to ${name}!`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading italic font-semibold mb-2">Team Builder</h1>
        <p className="text-black/60 text-lg">Connect with builders, designers, and operators passionate about the same space.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="glass-card bg-white border-black/5 hover:border-black/10 transition-all group">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="h-16 w-16 rounded-full bg-black/5 border border-black/10 overflow-hidden flex-shrink-0">
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate">{profile.name}</CardTitle>
                <CardDescription className="text-sm font-medium flex items-center gap-1 mt-1">
                  <profile.icon className="h-3 w-3" />
                  {profile.role}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-xs text-black/40 uppercase tracking-wider block mb-2">Top Skills</span>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-black/5 text-black/70 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-black/40 uppercase tracking-wider block mb-2">Interested In</span>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full border border-black/10 text-black/60 font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full group-hover:bg-black group-hover:text-white transition-colors"
                onClick={() => handleConnect(profile.name)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
