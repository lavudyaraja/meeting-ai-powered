import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, ChevronDown, Video, CheckSquare, Workflow, Zap, PlayCircle, Bot, Puzzle, Users, BookOpen, FileText, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const featuredItems = [
    { name: "Meetings", path: "/meetings", icon: Video },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Workflows", path: "/workflows", icon: Workflow },
    { name: "Automation", path: "/automation", icon: Zap },
  ];

  const toolsItems = [
    { name: "Recordings", path: "/recordings", icon: PlayCircle },
    { name: "AI Assistant", path: "/ai-meeting-assistant", icon: Bot },
    { name: "Integrations", path: "/integrations", icon: Puzzle },
  ];

  const resourcesItems = [
    { name: "Knowledge Base", path: "/knowledge-base", icon: BookOpen },
    { name: "Templates", path: "/templates", icon: FileText },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (path) => {
    console.log('Navigate to:', path);
    navigate(path);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10' 
          : 'bg-slate-950/80 backdrop-blur-sm border-b border-white/5'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group z-50" 
              onClick={() => handleNavClick("/")}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MeetingsAI
                </span>
                <span className="hidden sm:block text-xs text-slate-400 -mt-1">Powered by Intelligence</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick("/")}
                className="px-3 xl:px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                Home
              </button>

              {/* Products Dropdown */}
              <div className="relative group">
                <button className="px-3 xl:px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1">
                  Products
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden shadow-2xl">
                  <div className="p-2 bg-slate-900/90 backdrop-blur-lg rounded-xl">
                    {featuredItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleNavClick(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <Icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tools Dropdown */}
              <div className="relative group">
                <button className="px-3 xl:px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1">
                  Tools
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden shadow-2xl">
                  <div className="p-2 bg-slate-900/90 backdrop-blur-lg rounded-xl">
                    {toolsItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleNavClick(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <Icon className="w-4 h-4 text-purple-400" />
                          </div>
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Resources Dropdown */}
              <div className="relative group">
                <button className="px-3 xl:px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1">
                  Resources
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden shadow-2xl">
                  <div className="p-2 bg-slate-900/90 backdrop-blur-lg rounded-xl">
                    {resourcesItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleNavClick(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <Icon className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3 z-50">
              <Button 
                onClick={() => handleNavClick("/auth")}
                className="bg-transparent border border-white/20 text-white hover:bg-white/10 px-4 sm:px-6 text-sm transition-all duration-300"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => handleNavClick("/auth")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 text-sm"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
      }`}>
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        <div className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-slate-950 border-l border-white/10 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-20 sm:pt-24">
            {/* Mobile Home Link */}
            <button
              onClick={() => handleNavClick("/")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all mb-2"
            >
              <Rocket className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Home</span>
            </button>

            {/* Mobile Products Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleDropdown('products')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <span>Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'products' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'products' ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-4 bg-slate-900/50 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                  {featuredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Icon className="w-5 h-5 text-blue-400" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Tools Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleDropdown('tools')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <span>Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'tools' ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-4 bg-slate-900/50 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                  {toolsItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Icon className="w-5 h-5 text-purple-400" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Resources Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleDropdown('resources')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'resources' ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-4 bg-slate-900/50 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                  {resourcesItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile CTA Buttons */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <Button 
                onClick={() => handleNavClick("/auth")}
                className="w-full bg-transparent border border-white/20 text-white hover:bg-white/10 py-6"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => handleNavClick("/auth")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;