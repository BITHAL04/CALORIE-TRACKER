import ImageCarousel from '../ui-components/parts/ImageCarousel';
import { ArrowUpRight } from 'lucide-react';
import {SignUpButton} from '@clerk/clerk-react';
import { motion } from "framer-motion";

const SecondaryContent = () => {
  const carouselImages = [
    "/carousel-img-1.webp",
    "/carousel-img-2.webp",
    "/carousel-img-3.webp"
  ];

  return (
    <div className="relative z-50 px-4 md:px-8 lg:px-16 xl:px-24 py-16">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="md:w-1/2 md:pr-8">
          <h2 className="text-3xl text-nexafit-footer font-bold mb-6 text-gray-800">Transform Your Nutrition</h2>
          <p className="text-lg text-nexafit-footer mb-8">
              We're understand that the one-size-fits-all health plans are little more than empty wellness promises. We push limits, break molds, and call you into your power. No fluff. No excuses. Just raw, tailored support that hits where it matters.  This is your rebellion against your own sense of mediocrity — and we're right there with you.
          </p>
          <div className="bg-nexafit-accent w-full max-w-md rounded-xl flex items-center justify-center mb-8 md:mb-0">
            <div className="p-8 text-nexafit-footer">
                <h3 className="text-2xl mb-2 font-black">Start Today</h3>
                    
                        <div>
                            <h3 className="text-xl font-medium">
                                Create a personalized meal plan or check your workout stats in just a few clicks.
                            </h3>
                            <SignUpButton mode="modal">
                                <motion.div
                                  whileHover={{ scale: 1.2 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <ArrowUpRight className="h-10 w-10" />
                                </motion.div>
                            </SignUpButton>
                        </div>
                    
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <ImageCarousel images={carouselImages} />
        </div>
      </div>
    </div>
  );
};

export default SecondaryContent;