
import InfoPageLayout from '@/components/layouts/InfoPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, LineChart, Utensils, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-nexafit-lightGreen" />,
      title: "Health First",
      description: "We believe in promoting sustainable, healthy habits over quick fixes. Our approach is grounded in nutritional science and exercise physiology."
    },
    {
      icon: <Users className="h-8 w-8 text-nexafit-lightGreen" />,
      title: "Community Driven",
      description: "We're building more than an app – we're creating a community of like-minded individuals supporting each other on their fitness journeys."
    },
    {
      icon: <LineChart className="h-8 w-8 text-nexafit-lightGreen" />,
      title: "Data Informed",
      description: "Our recommendations are powered by cutting-edge algorithms and machine learning, providing personalized insights based on your unique profile."
    },
    {
      icon: <Utensils className="h-8 w-8 text-nexafit-lightGreen" />,
      title: "Balanced Nutrition",
      description: "We promote a balanced approach to eating that's both nutritious and enjoyable, because we believe food should fuel your body and delight your senses."
    }
  ];
  
  return (
    <InfoPageLayout
      title="About Us"
      subtitle="Empowering your fitness journey with personalized guidance"
    >
      <div className="space-y-12">
        {/* Our Story Section */}
        <section>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-nexafit-accent">Our Story</h2>
              <div className="space-y-4">
                <p>
                  nexaFit was born from a simple observation: despite the abundance of fitness apps, 
                  many people still struggle to find sustainable ways to achieve their health goals.
                </p>
                <p>
                  Founded in 2025, we set out to create a solution that combines cutting-edge technology 
                  with practical, science-backed fitness guidance. Our mission is to make personalized 
                  fitness accessible to everyone, regardless of their starting point or goals.
                </p>
                <p>
                  What sets us apart is our holistic approach. Instead of focusing solely on workouts 
                  or diet in isolation, we integrate calorie tracking, meal planning, and personalized 
                  recommendations into a seamless experience that adapts to your unique needs.
                </p>
              </div>
            </div>
            <div className="md:w-1/3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-nexafit-accent to-nexafit-lightGreen rounded-lg p-6 text-white h-full flex flex-col justify-center"
              >
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-white/90">
                  To empower individuals to take charge of their health through personalized, 
                  science-backed nutrition and fitness guidance that fits seamlessly into their lives.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-nexafit-accent">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-l-4 border-l-nexafit-lightGreen">
                  <CardContent className="p-6">
                    <div className="mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* What Makes Us Different Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-nexafit-accent">What Makes Us Different</h2>
          <div className="bg-gradient-to-r from-nexafit-accent/10 to-nexafit-lightGreen/10 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-nexafit-lightGreen rounded-full p-2 mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Personalized Experience</h3>
                <p className="text-muted-foreground">
                  We don't believe in one-size-fits-all solutions. Every recommendation, from calorie predictions 
                  to meal plans, is tailored to your unique profile, preferences, and goals.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-nexafit-lightGreen rounded-full p-2 mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Science-Backed Approach</h3>
                <p className="text-muted-foreground">
                  Our algorithms are developed in collaboration with nutritionists and fitness experts, 
                  ensuring that our guidance is grounded in the latest scientific research.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-nexafit-lightGreen rounded-full p-2 mt-1">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Holistic Integration</h3>
                <p className="text-muted-foreground">
                  We seamlessly integrate workout tracking, calorie prediction, and meal planning to provide 
                  a comprehensive view of your fitness journey, helping you make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-nexafit-accent">Meet the Team</h2>
          <p className="mb-6">
            nexaFit is brought to you by a passionate team of developers, nutritionists, fitness experts, 
            and data scientists who share a common goal: to help you achieve your health and fitness goals.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/about-creator" 
              className="inline-block py-2 px-6 bg-nexafit-accent text-white rounded-full hover:bg-nexafit-accent/90 transition-colors"
            >
              About the Creator
            </Link>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default AboutUs;
