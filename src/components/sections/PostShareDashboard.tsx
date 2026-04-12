import { useState } from 'react';
import { MessageSquare, Users, Lock, CheckCircle, Camera, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostActionModal from '@/components/modals/PostActionModal';
import { toast } from '@/hooks/use-toast';

const PostShareDashboard = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleTakeChallenge = (challengeTitle: string) => {
    toast({
      title: "Challenge Claimed! 🎯",
      description: `You've claimed: "${challengeTitle}". Start working and post updates!`,
    });
  };

  const handleViewAllChallenges = () => {
    toast({
      title: "All Challenges 🌍",
      description: "Browse all available environmental challenges in your area.",
    });
  };

  const handleChatAction = () => {
    toast({
      title: "Chat Coming Soon! 💬",
      description: "Community chat features will be available in the full app.",
    });
  };
  const adminPosts = [
    {
      id: 1,
      type: "URGENT",
      title: "Plastic pollution crisis at Marina Beach",
      location: "Chennai, Tamil Nadu",
      description: "Massive plastic waste accumulation after monsoon. Immediate cleanup required before it affects marine life.",
      image: "🏖️",
      timePosted: "2 hours ago",
      status: "OPEN",
      assignedTo: null,
      difficulty: "Medium",
      estimatedPoints: 150,
      requiredActions: ["Organize cleanup team", "Document before/after", "Proper waste disposal"]
    },
    {
      id: 2,
      type: "ONGOING",
      title: "Tree plantation drive in Lalbagh area",
      location: "Bangalore, Karnataka", 
      description: "Monthly tree plantation initiative. Need volunteers to plant native species and ensure proper watering setup.",
      image: "🌳",
      timePosted: "5 hours ago",
      status: "LOCKED",
      assignedTo: "EcoWarrior_Raj",
      difficulty: "Easy",
      estimatedPoints: 100,
      requiredActions: ["Plant 20+ saplings", "Install drip irrigation", "Create care schedule"]
    },
    {
      id: 3,
      type: "CRITICAL",
      title: "Industrial waste contaminating river",
      location: "Coimbatore, Tamil Nadu",
      description: "Chemical discharge from textile factories turning river water toxic. Requires documentation and awareness campaign.",
      image: "🏭",
      timePosted: "1 day ago",
      status: "LOCKED",
      assignedTo: "GreenActivist_Maya",
      difficulty: "Hard",
      estimatedPoints: 300,
      requiredActions: ["Document evidence", "File complaint", "Organize awareness rally"]
    }
  ];

  const userActivePosts = [
    {
      id: 1,
      title: "Solar panel installation in community center",
      location: "Whitefield, Bangalore",
      progress: 75,
      startDate: "2024-01-15",
      estimatedCompletion: "2024-01-25",
      updates: [
        { date: "2024-01-20", update: "Panels delivered and team assembled", image: "📦" },
        { date: "2024-01-18", update: "Permits approved by local authorities", image: "📋" },
        { date: "2024-01-16", update: "Site survey completed", image: "📏" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'from-green-500 to-emerald-600';
      case 'LOCKED': return 'from-red-500 to-orange-600';
      case 'COMPLETED': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'URGENT': return 'from-red-500 to-red-600';
      case 'CRITICAL': return 'from-purple-500 to-purple-600';
      case 'ONGOING': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      <PostActionModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    <section id="post-share" className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            <span className="text-glow bg-gradient-to-r from-accent to-accent-solar bg-clip-text text-transparent">
              Post & Share
            </span>{' '}
            Dashboard
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
            A revolutionary admin-user interaction system where environmental challenges meet actionable solutions. 
            Admins post problems, users claim and solve them, creating accountability and impact tracking like never before.
          </p>
        </div>

        {/* Innovation Highlight */}
        <div className="mb-16 fade-in">
          <div className="glass-card-accent p-8 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-orbitron font-bold mb-4 text-glow-accent">
                🚀 Revolutionary Social Impact System
              </h3>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Unlike Instagram or Snapchat where content disappears, GreenFeed creates 
                <strong> persistent environmental challenges</strong> that get locked to specific users, 
                ensuring accountability and measurable impact. Every post represents a real-world problem 
                getting solved by a committed individual.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Admin Challenge Posts */}
          <div className="slide-in-left">
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-orbitron font-bold flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-accent-solar" />
                  Environmental Challenges
                </h3>
                <div className="px-3 py-1 bg-gradient-accent rounded-full text-white text-sm font-semibold">
                  Admin Posted
                </div>
              </div>

              <div className="space-y-6">
                {adminPosts.map((post, index) => (
                  <div key={post.id} className="relative group">
                    <div className="glass-card p-6 rounded-xl hover-lift border border-primary/20">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{post.image}</div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className={`px-2 py-1 bg-gradient-to-r ${getTypeColor(post.type)} rounded-full text-white text-xs font-bold`}>
                                {post.type}
                              </div>
                              <div className={`px-2 py-1 bg-gradient-to-r ${getStatusColor(post.status)} rounded-full text-white text-xs font-bold flex items-center`}>
                                {post.status === 'LOCKED' ? <Lock className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                                {post.status}
                              </div>
                            </div>
                            <h4 className="font-orbitron font-bold text-lg">{post.title}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-orbitron font-black text-accent-solar">+{post.estimatedPoints}</div>
                          <div className="text-xs text-foreground/60">points</div>
                        </div>
                      </div>

                      {/* Location & Time */}
                      <div className="flex items-center space-x-4 text-sm text-foreground/60 mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{post.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.timePosted}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-foreground/80 mb-4 leading-relaxed">{post.description}</p>

                      {/* Required Actions */}
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-primary">Required Actions:</h5>
                        <div className="space-y-1">
                          {post.requiredActions.map((action, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-gradient-primary rounded-full"></div>
                              <span className="text-foreground/70">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assignment Status */}
                      {post.status === 'LOCKED' && post.assignedTo ? (
                        <div className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-red-500/20">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-red-400" />
                            <span className="text-sm">Assigned to: <strong>{post.assignedTo}</strong></span>
                          </div>
                          <Button size="sm" variant="outline" className="text-primary border-primary/30 text-xs">
                            View Progress
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Available to claim</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-gradient-primary text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                            onClick={() => handleTakeChallenge(post.title)}
                          >
                            Take Challenge
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6 border-primary/30 text-primary rounded-xl"
                onClick={handleViewAllChallenges}
              >
                View All Challenges
              </Button>
            </div>
          </div>

          {/* User Active Projects */}
          <div className="slide-in-right">
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-orbitron font-bold flex items-center">
                  <Camera className="w-6 h-6 mr-3 text-primary" />
                  My Active Projects
                </h3>
                <div className="px-3 py-1 bg-gradient-primary rounded-full text-white text-sm font-semibold">
                  1 Active
                </div>
              </div>

              {userActivePosts.map((project, index) => (
                <div key={project.id} className="glass-card p-6 rounded-xl border border-primary/30 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-orbitron font-bold text-lg mb-1">{project.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-foreground/60">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{project.progress}%</div>
                      <div className="text-xs text-foreground/60">Complete</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-foreground/10 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-foreground/60">
                      <span>Started: {project.startDate}</span>
                      <span>ETA: {project.estimatedCompletion}</span>
                    </div>
                  </div>

                  {/* Updates Timeline */}
                  <div className="space-y-3 mb-6">
                    <h5 className="font-semibold text-primary">Recent Updates:</h5>
                    {project.updates.map((update, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-gradient-card rounded-lg">
                        <div className="text-xl">{update.image}</div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground/80">{update.update}</p>
                          <div className="text-xs text-foreground/60 mt-1">{update.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary text-white font-semibold rounded-lg flex-1"
                      onClick={() => setIsPostModalOpen(true)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Add Update
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-secondary text-secondary rounded-lg"
                      onClick={handleChatAction}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              ))}

              {/* Upload Photo Section */}
              <div className="glass-card-accent p-6 rounded-xl text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-accent" />
                <h4 className="font-orbitron font-bold mb-2">Share Your Eco-Action</h4>
                <p className="text-sm text-foreground/70 mb-4">
                  Document your environmental impact and inspire others to take action
                </p>
                <Button 
                  className="bg-gradient-accent text-white font-semibold rounded-xl w-full"
                  onClick={() => setIsPostModalOpen(true)}
                >
                  Upload Photo/Video
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Innovation Explanation */}
        <div className="mt-16 fade-in">
          <div className="glass-card p-12 rounded-2xl text-center">
            <h3 className="text-3xl font-orbitron font-bold mb-8">
              Beyond Traditional Social Media
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-orbitron font-bold">Challenge Locking</h4>
                <p className="text-sm text-foreground/70">
                  Once you claim a challenge, it's locked to you, creating accountability and preventing duplication
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-orbitron font-bold">Admin Verification</h4>
                <p className="text-sm text-foreground/70">
                  Environmental experts post real challenges and verify completed actions for authenticity
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-orbitron font-bold">Impact Tracking</h4>
                <p className="text-sm text-foreground/70">
                  Every action is tracked from start to completion, creating a permanent record of environmental impact
                </p>
              </div>
            </div>

            <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              This system ensures that every environmental challenge posted gets addressed by a committed individual, 
              creating real-world impact rather than just social media engagement. It's <strong>purpose-driven social networking</strong> 
              that transforms online activity into measurable environmental action.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default PostShareDashboard;