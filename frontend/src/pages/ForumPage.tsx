
import { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import Navbar_global from '../components/ui-components/navbars/Navbar-global';
import Footer from '../components/ui-components/Footer';
import BackgroundElements from '../components/ui-components/BackgroundElements';
import ForumPostsList from '../components/forum-components/ForumPostsList';
import ForumSidebar from '../components/forum-components/ForumSidebar';
import { useToast } from "@/hooks/use-toast";

const ForumPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  return (
    <div className="relative min-h-screen bg-nexafit-background text-black overflow-hidden">
      <BackgroundElements />
      <Navbar_global />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-nexafit-navbar">
          nexaFit Community Forum
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with others, share experiences, and get advice on your fitness and nutrition journey
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-9 order-2 lg:order-1">
            <ForumPostsList selectedTag={selectedTag} />
          </div>
          
          <div className="lg:col-span-3 order-1 lg:order-2">
            <ForumSidebar onTagSelect={handleTagSelect} selectedTag={selectedTag} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForumPage;
