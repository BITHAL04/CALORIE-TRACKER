
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 800); // Wait for exit animation to complete
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {(showLoader) && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-nexafit-background"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.5, 
            transition: { 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1] 
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex flex-col items-center"
          >
            <motion.img 
              src="/nexaFit_pixel_font.gif" 
              alt="NexaFit"
              className="w-64 sm:w-80 max-w-full"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut" 
              }}
            />
            
            <motion.div 
              className="mt-8 flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="h-3 w-3 rounded-full bg-nexafit-lightGreen"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
