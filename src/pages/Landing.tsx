import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Shield,
  BarChart,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Users,
  Star,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-image.jpg";
import gradientBg from "@/assets/gradient-bg.svg";
import { LandingDashboardPreview } from "@/components/LandingDashboardPreview";

export const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Stats data
  const stats = [
    { value: "2,500+", label: t("stats.farmers") || "Farmers" },
    { value: "98%", label: t("stats.compliance") || "Compliance Rate" },
    { value: "30%", label: t("stats.reduction") || "AMU Reduction" },
    { value: "24/7", label: t("stats.support") || "Support" }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "JeevanDhara has transformed how we manage our livestock. The AMU tracking features have helped us reduce antimicrobial usage by 40% while maintaining animal health.",
      author: "Rajesh Kumar",
      role: "Dairy Farmer, Punjab",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      quote: "The compliance management tools have made regulatory reporting so much easier. What used to take days now takes minutes, and we're always audit-ready.",
      author: "Anita Sharma",
      role: "Poultry Farm Manager, Gujarat",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      quote: "The AI assistant has been incredibly helpful for quick answers about withdrawal periods and dosage calculations. It's like having an expert on call 24/7.",
      author: "Vikram Singh",
      role: "Livestock Specialist, Haryana",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Trigger animation when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-background/90 to-muted/90">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Floating elements for background effect */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-blue-500/5 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-yellow-500/5 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 relative">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">JeevanDhara</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a>
              <a href="#benefits" className="text-foreground/80 hover:text-primary transition-colors">Benefits</a>
              <a href="#testimonials" className="text-foreground/80 hover:text-primary transition-colors">Testimonials</a>
              <a href="#faq" className="text-foreground/80 hover:text-primary transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                {t("signIn") || "Sign In"}
              </Button>
              <Button onClick={() => navigate("/auth")} className="bg-gradient-primary hover:shadow-lg transition-all duration-300">
                {t("GetStarted") || "Get Started"}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="flex flex-col space-y-4 p-6">
              <a href="#features" className="text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#benefits" className="text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Benefits</a>
              <a href="#testimonials" className="text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
              <a href="#faq" className="text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="outline" onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}>
                  {t("signIn") || "Sign In"}
                </Button>
                <Button onClick={() => { navigate("/auth"); setIsMenuOpen(false); }} className="bg-gradient-primary">
                  {t("GetStarted") || "Get Started"}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-6 relative z-10"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Star className="h-3.5 w-3.5 mr-1" />
              <span>{t("hero.badge") || "India's #1 Farm Compliance Platform"}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              {t("hero.title") || "Smart Farming with "}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("hero.subtitle") || "Simplify your farm management, monitor antimicrobial usage, and ensure compliance with regulations - all in one powerful platform."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="bg-gradient-primary hover:shadow-lg transition-all duration-300">
                {t("GetStarted") || "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
            </div>
            <div className="pt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i}.jpg`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-primary font-semibold">2,500+</span> farmers trust JeevanDhara
              </div>
            </div>
          </motion.div>
          <motion.div className="relative" variants={itemVariants}>
            {/* 3D-like Hero Element with CSS animations */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="relative bg-gradient-to-br from-card/80 to-card/40 p-2 rounded-2xl shadow-2xl border border-border/50 overflow-hidden h-[400px] flex items-center justify-center backdrop-blur-sm">
              {/* Interactive 3D Dashboard Preview */}
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner">
                {/* Background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-muted/5"></div>
                
                {/* Animated floating elements representing farm data */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-primary/20 rounded-full blur-sm animate-pulse delay-500"></div>
                <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-blue-500/20 rounded-full blur-sm animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/3 right-1/4 w-7 h-7 bg-yellow-500/20 rounded-full blur-sm animate-pulse delay-1500"></div>
                
                {/* Central interactive dashboard element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 transform-gpu group">
                    <div className="absolute inset-0 bg-gradient-primary rounded-2xl shadow-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                    <div className="absolute inset-0 bg-primary/30 rounded-2xl shadow-lg transform -rotate-6 group-hover:-rotate-12 transition-transform duration-500 delay-100"></div>
                    <div className="absolute inset-4 bg-card rounded-xl flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <Leaf className="h-12 w-12 text-primary mb-2" />
                      <span className="text-sm font-semibold text-foreground">JeevanDhara</span>
                      <span className="text-xs text-muted-foreground mt-1">Farm Management</span>
                    </div>
                  </div>
                </div>
                
                {/* Interactive data points */}
                <div className="absolute top-6 left-6 bg-card/80 p-2 rounded-lg shadow border border-border backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">AMU: 30% ↓</span>
                  </div>
                </div>
                
                <div className="absolute top-6 right-6 bg-card/80 p-2 rounded-lg shadow border border-border backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium">Farms: 2.5K+</span>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-card/80 p-2 rounded-lg shadow border border-border backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-xs font-medium">98% Compliant</span>
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-6 transform rotate-3 bg-card/80 p-2 rounded-lg shadow border border-border backdrop-blur-sm hover:rotate-6 transition-transform duration-300 cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <div className="text-xs font-bold text-primary">AI</div>
                    <span className="text-xs">Assistant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-primary/5 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30 relative z-10">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("features.title") || "Powerful Features for Modern Farming"}
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("features.subtitle") || "Everything you need to manage your farm efficiently and comply with regulations"}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart className="h-10 w-10 text-primary" />,
                title: t("feature.amuMonitoring.title") || "AMU Monitoring",
                description: t("feature.amuMonitoring.desc") || "Track and monitor antimicrobial usage with detailed analytics and reporting. Get insights on usage patterns and identify areas for improvement."
              },
              {
                icon: <Shield className="h-10 w-10 text-primary" />,
                title: t("feature.compliance.title") || "Compliance Management",
                description: t("feature.compliance.desc") || "Stay compliant with regulations and maintain proper documentation. Automated alerts ensure you never miss important deadlines."
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-primary" />,
                title: t("feature.assistant.title") || "AI Assistant",
                description: t("feature.assistant.desc") || "Get instant answers to your farming and compliance questions. Our AI assistant is trained on the latest agricultural regulations and best practices."
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: t("feature.withdrawal.title") || "Withdrawal Period Tracking",
                description: t("feature.withdrawal.desc") || "Automatically track withdrawal periods for all medications. Receive timely alerts when animals are approaching clearance dates."
              },
              {
                icon: <Download className="h-10 w-10 text-primary" />,
                title: t("feature.export.title") || "Export & Reporting",
                description: t("feature.export.desc") || "Generate comprehensive reports for regulatory submissions. Export data in multiple formats for easy sharing with authorities."
              },
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: t("feature.team.title") || "Team Collaboration",
                description: t("feature.team.desc") || "Collaborate with your team members, veterinarians, and consultants. Assign tasks and share important information securely."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* 3D-like icon with CSS effects */}
                <div className="mb-4 h-16 flex items-center justify-center transform-gpu group-hover:scale-110 transition-transform duration-300">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/10 rounded-full transform rotate-12 group-hover:rotate-45 transition-transform duration-300"></div>
                    <div className="absolute inset-2 bg-primary/20 rounded-full transform -rotate-12 group-hover:-rotate-45 transition-transform duration-300"></div>
                    <div className="relative text-primary">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose JeevanDhara?</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Reduce AMU by up to 30%",
                    description: "Our smart analytics help identify patterns and opportunities to optimize antimicrobial usage while maintaining animal health."
                  },
                  {
                    title: "Save 15+ hours per week on compliance",
                    description: "Automated record-keeping and reporting drastically reduce the administrative burden on your farm staff."
                  },
                  {
                    title: "Minimize withdrawal period violations",
                    description: "Proactive alerts and tracking ensure you never miss a withdrawal period, protecting consumer safety and your reputation."
                  },
                  {
                    title: "24/7 Support and Training",
                    description: "Our dedicated support team and comprehensive training resources ensure you get the most out of JeevanDhara."
                  }
                ].map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="mt-1 bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -z-10 w-full h-full bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl -rotate-6 transform-gpu"></div>
              <LandingDashboardPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-muted/30 relative z-10">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              What Our Users Say
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of satisfied farmers who have transformed their operations with JeevanDhara
            </motion.p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -z-10 w-full h-full bg-primary/5 rounded-3xl -rotate-3 transform-gpu"></div>
            <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-lg">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`transition-opacity duration-500 ${index === activeTestimonial ? 'block opacity-100' : 'hidden opacity-0'}`}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 flex-shrink-0">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <p className="text-lg md:text-xl italic text-foreground/90">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeTestimonial ? 'bg-primary' : 'bg-primary/20'}`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 relative z-10">
        <div className="container mx-auto space-y-12 max-w-4xl">
          <div className="text-center space-y-4">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Find answers to common questions about JeevanDhara
            </motion.p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How does JeevanDhara help with regulatory compliance?",
                answer: "JeevanDhara automates record-keeping, provides real-time compliance monitoring, and generates reports required by regulatory authorities. The system keeps track of all antimicrobial usage, withdrawal periods, and other critical compliance data, making audits and inspections stress-free."
              },
              {
                question: "Is my data secure on the JeevanDhara platform?",
                answer: "Absolutely. JeevanDhara employs enterprise-grade security measures including end-to-end encryption, secure data centers, and regular security audits. Your farm data is completely private and only accessible to authorized users you designate."
              },
              {
                question: "Can JeevanDhara integrate with my existing farm management software?",
                answer: "Yes, JeevanDhara offers API integration with most popular farm management systems. Our team can help set up custom integrations to ensure seamless data flow between your existing tools and JeevanDhara."
              },
              {
                question: "How long does it take to implement JeevanDhara on my farm?",
                answer: "Most farms are up and running with JeevanDhara within 1-2 weeks. Our onboarding team provides comprehensive training and support to ensure a smooth transition. The system is designed to be user-friendly with minimal learning curve."
              },
              {
                question: "What kind of support does JeevanDhara provide?",
                answer: "JeevanDhara offers 24/7 customer support via chat, email, and phone. We also provide regular training sessions, webinars, and a comprehensive knowledge base to help you get the most out of the platform."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden hover:border-primary/20 transition-colors">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-medium group-open:text-primary transition-colors">{faq.question}</h3>
                    <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center group-open:border-primary group-open:bg-primary/10 transition-colors">
                      <ChevronRight className="h-3 w-3 group-open:rotate-90 transition-transform duration-300" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-primary text-primary-foreground relative z-10">
        <div className="container mx-auto text-center space-y-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Farm Management?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of farmers who are already using JeevanDhara to improve their farm management and compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate("/auth")}
              className="hover:shadow-lg transition-all duration-300"
            >
              Get Started Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white/20 hover:bg-white/10 transition-colors"
            >
              Schedule a Demo
            </Button>
          </div>
          <div className="pt-8 text-sm opacity-80">
            No credit card required • Free 30-day trial • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card border-t border-border relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Leaf className="h-3 w-3 text-white" />
                </div>
                <span className="text-lg font-semibold">JeevanDhara</span>
              </div>
              <p className="text-muted-foreground">
                {t("footer.empowering") || "Empowering farmers with smart technology for better compliance and sustainable farming practices."}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer.product") || "Product"}</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.features") || "Features"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.pricing") || "Pricing"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.caseStudies") || "Case Studies"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.integrations") || "Integrations"}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer.resources") || "Resources"}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.documentation") || "Documentation"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.blog") || "Blog"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.webinars") || "Webinars"}</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.faq") || "FAQ"}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer.company") || "Company"}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.aboutUs") || "About Us"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.careers") || "Careers"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.contact") || "Contact"}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.privacy") || "Privacy Policy"}</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} JeevanDhara. {t("footer.allRights") || "All rights reserved."}
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Facebook</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;