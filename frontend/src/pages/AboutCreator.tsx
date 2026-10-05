
import InfoPageLayout from '@/components/layouts/InfoPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Mail, Brush  } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutCreator = () => {
  const skills = [
    "Full Stack Development", 
    "UI/UX Design", 
    "Machine Learning", 
    "Data Science", 
    "Graphic Design"
  ];
  
  return (
    <InfoPageLayout
      title="About the Creator"
      subtitle="The mind behind nexaFit"
    >
      <div className="space-y-12">
        {/* Bio Section */}
        <section className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-nexafit-accent">Meet the Creator</h2>
            <div className="space-y-4">
              <p>
                    Hello! I'm the creator of nexaFit. My journey to creating this platform began with my own struggles in finding the right balance between nutrition and fitness. As someone passionate about technology and health, I saw an opportunity to combine these interests to help others on their fitness journeys.
              </p>
              <p>
                    With a background in computer science and a deep interest in health and nutrition, I've spent years studying the intersection of technology and wellness. nexaFit represents the culmination of this research and passion, designed to provide personalized fitness guidance backed by science.
              </p>
              <p>
                    In addition to nexaFit, I also built <a href="https://mindease-eight.vercel.app" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-nexafit-accent">MindEase</a>, a mental wellness app created to support emotional well-being through guided journaling, mood tracking, and science-backed coping strategies. I believe that true health is holistic—balancing both body and mind—and MindEase was born from that philosophy.    
              </p>
              <p>
                    Beyond coding, I'm an avid runner, enjoy experimenting with new recipes in the kitchen, and am constantly reading the latest research in nutrition, exercise science, and mental health to enhance both nexaFit and MindEase.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
              <div className="flex flex-wrap gap-3">
                  <a href="https://github.com/ezahpizza" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Github size={16} /> GitHub
                    </Button>
                  </a>

                  <a href="https://linkedin.com/in/prateekmp/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Linkedin size={16} /> LinkedIn
                    </Button>
                  </a>

                  <a href="https://www.behance.net/prateekmohapat" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Brush size={16} /> Behance
                    </Button>
                  </a>

                  <a href="mailto:your-prateekmsoa@gmail.com">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail size={16} /> Email
                    </Button>
                  </a>

              </div>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-nexafit-accent to-nexafit-lightGreen rounded-lg p-6 text-white h-full"
            >
              <div className="aspect-square rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/Prateek-Mohapatra.webp" 
                    alt="NexaFit hero" 
                    className="w-full h-full object-cover rounded-full"
                  />
              </div>

              <h3 className="text-xl font-bold text-center mb-2">Founder & Developer</h3>
              <p className="text-white/90 text-center">
                My goal is to make personalized fitness accessible to everyone, regardless of their 
                starting point or background.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Skills & Expertise */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-nexafit-accent">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-nexafit-accent/10 text-nexafit-accent px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </section>
        
        {/* The Journey Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-nexafit-accent">The Journey to nexaFit</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-nexafit-lightGreen/20 flex items-center justify-center shrink-0">
                    <span className="text-nexafit-accent font-bold">02/25</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">The Concept</h3>
                    <p className="text-muted-foreground">
                      The idea for nexaFit was born during a personal fitness journey, where I realized the need for a more 
                      integrated approach to fitness tracking and meal planning.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-nexafit-lightGreen/20 flex items-center justify-center shrink-0">
                    <span className="text-nexafit-accent font-bold">03/25</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Research & Development</h3>
                    <p className="text-muted-foreground">
                      Spent a month researching nutritional science, exercise physiology, and machine learning algorithms to create 
                      the foundation for nexaFit's core features.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-nexafit-lightGreen/20 flex items-center justify-center shrink-0">
                    <span className="text-nexafit-accent font-bold">04/25</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">nexaFit Launch</h3>
                    <p className="text-muted-foreground">
                      After extensive testing and refinement, nexaFit was launched with its core features: calorie prediction, 
                      meal planning, and personalized fitness recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Vision for the Future */}
        <section className="bg-gradient-to-r from-nexafit-accent/10 to-nexafit-lightGreen/10 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-nexafit-accent">Vision for the Future</h2>
          <p className="mb-6">
            nexaFit is just getting started. The roadmap ahead includes exciting features like:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Advanced workout tracking with AI form analysis</li>
            <li>Social community features for accountability and motivation</li>
            <li>Integration with wearable devices for real-time health data</li>
            <li>Expanded recipe database with even more dietary options</li>
            <li>Personalized coaching through AI-driven insights</li>
          </ul>
          <p>
            The ultimate goal is to create a comprehensive wellness platform that supports not just 
            fitness and nutrition, but overall wellbeing, helping users lead healthier, happier lives.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default AboutCreator;
