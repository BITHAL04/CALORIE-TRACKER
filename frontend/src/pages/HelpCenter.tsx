
import InfoPageLayout from '@/components/layouts/InfoPageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, BookOpen, HelpCircle, Smartphone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const categories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="h-6 w-6 text-nexafit-navbar" />,
      description: "Learn the basics of nexaFit and how to get started with your fitness journey",
      link: "#getting-started"
    },
    {
      title: "Meal Planning",
      icon: <HelpCircle className="h-6 w-6 text-nexafit-navbar" />,
      description: "Get help with our meal planning feature and understand how to use it",
      link: "#meal-planning"
    },
    {
      title: "Calorie Tracker",
      icon: <AlertCircle className="h-6 w-6 text-nexafit-navbar" />,
      description: "Learn how our calorie prediction system works and how to use it effectively",
      link: "#calorie-tracker"
    },
    {
      title: "Contact Support",
      icon: <Smartphone className="h-6 w-6 text-nexafit-navbar" />,
      description: "Get in touch with our support team for personalized assistance",
      link: "#contact"
    }
  ];

  const faqs = [
    {
      question: "How accurate is the calorie prediction feature?",
      answer: "Our calorie prediction feature uses advanced machine learning algorithms trained on extensive fitness data to provide estimates with approximately 85-90% accuracy. Results may vary based on individual factors like metabolism and exercise intensity."
    },
    {
      question: "Can I customize the meal plans to fit my dietary restrictions?",
      answer: "Yes! Our meal planner allows you to specify dietary preferences like vegetarian, vegan, gluten-free, and more. You can also exclude specific ingredients you're allergic to or simply don't enjoy."
    },
    {
      question: "How do I update my fitness profile?",
      answer: "Navigate to the Profile page from the main menu. There you can update your height, weight, fitness goals, activity level, and other personal details that help our algorithms provide more accurate recommendations."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We take data privacy very seriously. All your personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent. For more details, please read our Privacy Policy."
    },
    {
      question: "Can I export my meal plans and calorie data?",
      answer: "Currently, you can view your meal plans and calorie predictions within the app. We're working on an export feature that will allow you to download your data in various formats, which will be available in a future update."
    }
  ];

  return (
    <InfoPageLayout 
      title="Help Center" 
      subtitle="Find answers to common questions and learn how to make the most of nexaFit"
    >
      <div className="space-y-12">
        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">How can we help you today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="transform transition-all duration-200"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground flex-grow mb-4">{category.description}</p>
                    <a href={category.link} className="text-nexafit-green font-medium hover:text-nexafit-navbar transition-colors">
                      Learn more →
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Help Section */}
        <section id="getting-started">
          <h2 className="text-2xl font-semibold mb-6">Quick Start Guide</h2>
          <div className="space-y-4">
            <div className="bg-nexafit-accent/60 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">1. Create Your Profile</h3>
              <p>Start by setting up your fitness profile with your height, weight, goals, and activity level. This helps us personalize your experience.</p>
            </div>
            
            <div className="bg-nexafit-accent/60 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">2. Try the Calorie Predictor</h3>
              <p>Enter details about your workout in the Calorie Tracker to get an estimate of calories burned. This helps you understand your energy expenditure.</p>
            </div>
            
            <div className="bg-nexafit-accent/60 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">3. Plan Your Meals</h3>
              <p>Use our Meal Planner to create nutritious meal plans tailored to your dietary preferences and caloric needs.</p>
            </div>
            
            <div className="bg-nexafit-accent/60 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">4. Track Your Progress</h3>
              <p>Regularly update your profile as you progress on your fitness journey to keep your recommendations accurate.</p>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="meal-planning">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-br from-nexafit-navbar/10 to-nexafit-lightGreen/10 p-8 rounded-xl">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-nexafit-navbar" />
            <h2 className="text-2xl font-semibold mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our support team is ready to answer any questions you may have about nexaFit.
              We're here to help you make the most of your fitness journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" className="border-nexafit-navbar text-nexafit-navbar hover:bg-nexafit-navbar/10">
                <Smartphone  className="mr-2 h-4 w-4" /> 
                <Link 
                      to="/contact" className="text-sm hover:text-white/80">
                        Contact Our Support team
                  </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default HelpCenter;
