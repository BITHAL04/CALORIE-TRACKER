
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar_global from '../ui-components/navbars/Navbar-global';
import Footer from '../ui-components/Footer';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface InfoPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  withAnimation?: boolean;
  className?: string;
}

const InfoPageLayout = ({
  children,
  title,
  subtitle,
  withAnimation = true,
  className,
}: InfoPageLayoutProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      }
    }
  };

  return (
    <div className="min-h-screen bg-nexafit-background flex flex-col">
      <Navbar_global />
      
      <main className="flex-grow px-4 pb-16 pt-8 md:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={withAnimation ? "hidden" : false}
          animate={withAnimation ? "visible" : false}
          variants={containerVariants}
          className={cn("bg-nexafit-lightGreen/70 rounded-xl p-6 md:p-10 shadow-md", className)}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-nexafit-accent mb-2">{title}</h1>
            {subtitle && (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )}
            <div className="mt-4 h-1 w-20 bg-nexafit-lightGreen rounded"></div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="prose prose-lg max-w-none"
          >
            {children}
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InfoPageLayout;
