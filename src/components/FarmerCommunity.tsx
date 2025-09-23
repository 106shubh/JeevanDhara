import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Plus, 
  Search,
  Filter,
  MapPin,
  Calendar,
  TrendingUp,
  Bookmark,
  Flag,
  Camera,
  Video,
  FileText,
  Award,
  Clock,
  Eye,
  Heart,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface FarmerPost {
  id: string;
  author: {
    name: string;
    location: string;
    farmType: string;
    experience: number;
    reputation: number;
    avatar?: string;
  };
  content: string;
  images?: string[];
  timestamp: Date;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface ForumThread {
  id: string;
  title: string;
  category: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: Date;
  isPinned: boolean;
  isAnswered: boolean;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  author: string;
  category: string;
  readTime: number;
  votes: number;
  isVerified: boolean;
  publishDate: Date;
}

export default function FarmerCommunity() {
  const [posts, setPosts] = useState<FarmerPost[]>([]);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const { toast } = useToast();

  // Sample data initialization
  useEffect(() => {
    const samplePosts: FarmerPost[] = [
      {
        id: "1",
        author: {
          name: "Rajesh Patel",
          location: "Gujarat, India",
          farmType: "Dairy Farm",
          experience: 15,
          reputation: 92,
          avatar: "/api/placeholder/40/40"
        },
        content: "Just implemented a new automated milking system on my dairy farm. The efficiency has increased by 40% and the cows seem much more comfortable. Happy to share my experience and answer any questions about the transition process.",
        images: ["/api/placeholder/400/300"],
        timestamp: new Date(Date.now() - 3600000),
        category: "Technology",
        tags: ["automation", "dairy", "efficiency", "milk-production"],
        likes: 24,
        comments: 8,
        shares: 3,
        isLiked: false,
        isBookmarked: false
      },
      {
        id: "2",
        author: {
          name: "Priya Sharma",
          location: "Punjab, India",
          farmType: "Poultry Farm",
          experience: 8,
          reputation: 78
        },
        content: "Dealing with a respiratory issue in my poultry flock. Started treatment yesterday with the vet's prescription. Any similar experiences with respiratory diseases in chickens? Looking for natural remedies to support the medication.",
        timestamp: new Date(Date.now() - 7200000),
        category: "Health & Disease",
        tags: ["poultry", "respiratory", "treatment", "natural-remedies"],
        likes: 16,
        comments: 12,
        shares: 2,
        isLiked: true,
        isBookmarked: true
      },
      {
        id: "3",
        author: {
          name: "Mohammed Khan",
          location: "Uttar Pradesh, India",
          farmType: "Mixed Livestock",
          experience: 20,
          reputation: 96
        },
        content: "Sharing my cost-effective feed recipe that has improved milk yield by 25% while reducing feed costs by 15%. Key ingredients: corn silage 40%, alfalfa hay 25%, concentrate mix 30%, mineral supplements 5%. Works great for both dairy cows and buffaloes.",
        timestamp: new Date(Date.now() - 10800000),
        category: "Nutrition",
        tags: ["feed", "nutrition", "cost-effective", "milk-yield"],
        likes: 42,
        comments: 18,
        shares: 15,
        isLiked: false,
        isBookmarked: false
      }
    ];
    setPosts(samplePosts);

    const sampleThreads: ForumThread[] = [
      {
        id: "1",
        title: "Best practices for preventing mastitis in dairy cows",
        category: "Health & Disease",
        author: "Dr. Veterinarian",
        replies: 23,
        views: 156,
        lastActivity: new Date(Date.now() - 1800000),
        isPinned: true,
        isAnswered: true
      },
      {
        id: "2",
        title: "Organic vs conventional farming: Cost analysis discussion",
        category: "Economics",
        author: "GreenFarmer",
        replies: 34,
        views: 289,
        lastActivity: new Date(Date.now() - 3600000),
        isPinned: false,
        isAnswered: false
      }
    ];
    setForumThreads(sampleThreads);

    const sampleArticles: KnowledgeArticle[] = [
      {
        id: "1",
        title: "Complete Guide to Antimicrobial Usage Documentation",
        summary: "Learn proper documentation practices for AMU compliance and withdrawal period management",
        author: "Agricultural Extension Office",
        category: "Compliance",
        readTime: 8,
        votes: 156,
        isVerified: true,
        publishDate: new Date(Date.now() - 86400000)
      },
      {
        id: "2",
        title: "Seasonal Feed Management for Optimal Nutrition",
        summary: "Optimize your livestock nutrition across different seasons with proven feed strategies",
        author: "Nutrition Expert",
        category: "Nutrition",
        readTime: 12,
        votes: 203,
        isVerified: true,
        publishDate: new Date(Date.now() - 172800000)
      }
    ];
    setKnowledgeArticles(sampleArticles);
  }, []);

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
    
    const post = posts.find(p => p.id === postId);
    toast({
      title: post?.isBookmarked ? "Bookmark Removed" : "Post Bookmarked",
      description: post?.isBookmarked ? "Post removed from bookmarks" : "Post saved to your bookmarks"
    });
  };

  const createNewPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: FarmerPost = {
      id: Date.now().toString(),
      author: {
        name: "Your Name",
        location: "Your Location",
        farmType: "Your Farm Type",
        experience: 5,
        reputation: 75
      },
      content: newPostContent,
      timestamp: new Date(),
      category: newPostCategory,
      tags: [],
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
    setShowNewPostDialog(false);
    
    toast({
      title: "Post Created!",
      description: "Your post has been shared with the community"
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || post.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-foreground">Farmer Community</h2>
        <p className="text-muted-foreground">
          Connect, share experiences, and learn from fellow farmers
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="events">Events & Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6 mt-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts and discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setCategoryFilter(categoryFilter === "all" ? "technology" : "all")}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button onClick={() => setShowNewPostDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{post.author.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {post.author.farmType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {post.author.experience}y exp
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {post.author.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(post.timestamp).toLocaleString()}
                            </span>
                            <Badge variant={post.category === "Health & Disease" ? "destructive" : "default"} className="text-xs">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-foreground leading-relaxed">{post.content}</p>
                      
                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {post.images.map((image, imgIndex) => (
                            <img 
                              key={imgIndex}
                              src={image} 
                              alt="Post image" 
                              className="rounded-lg border max-h-60 object-cover w-full"
                            />
                          ))}
                        </div>
                      )}
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={post.isLiked ? "text-red-600" : ""}
                            onClick={() => handleLikePost(post.id)}
                          >
                            <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            {post.shares}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={post.isBookmarked ? "text-blue-600" : ""}
                          onClick={() => handleBookmarkPost(post.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="forum" className="space-y-6 mt-6">
          <div className="grid gap-4">
            {forumThreads.map((thread, index) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {thread.isPinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                          {thread.isAnswered && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Answered
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {thread.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                          {thread.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {thread.author}</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {thread.replies} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {thread.views} views
                          </span>
                          <span>{new Date(thread.lastActivity).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6 mt-6">
          <div className="grid gap-4">
            {knowledgeArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {article.isVerified && (
                            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">{article.summary}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {article.author}</span>
                          <span>{article.readTime} min read</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {article.votes} votes
                          </span>
                          <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Events & Groups Coming Soon</h3>
            <p className="text-muted-foreground">
              Join local farmer groups and attend agricultural events in your area
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share with the Community</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select 
                value={newPostCategory} 
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="general">General Discussion</option>
                <option value="technology">Technology & Innovation</option>
                <option value="health">Health & Disease</option>
                <option value="nutrition">Nutrition & Feed</option>
                <option value="economics">Economics & Finance</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Share your experience, ask questions, or provide advice to fellow farmers..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-32"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createNewPost} disabled={!newPostContent.trim()}>
                Share Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}