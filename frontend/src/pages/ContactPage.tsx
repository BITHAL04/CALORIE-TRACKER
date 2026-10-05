import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import Navbar_global from "@/components/ui-components/navbars/Navbar-global";
import Footer from "@/components/ui-components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import BackgroundElements from "@/components/ui-components/BackgroundElements";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-nexafit-background">
      <Navbar_global />
      <BackgroundElements />
      
      <main className="flex-grow px-4 pb-16 pt-8 md:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-nexafit-lightGreen rounded-xl p-6 md:p-10 shadow-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-nexafit-accent mb-2">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="mt-4 h-1 w-20 bg-nexafit-lightGreen rounded"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2 text-nexafit-accent">Get in Touch</h3>
                <p className="text-muted-foreground">
                  We're here to help and answer any questions you might have. 
                  We look forward to hearing from you.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-nexafit-accent">Office Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p className="text-muted-foreground">Saturday & Sunday: Closed</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-nexafit-accent">Contact Information</h3>
                <p className="text-muted-foreground">Email: nexafit.devs@gmail.com</p>
                <p className="text-muted-foreground">Phone: +91 7978268815</p>
                <p className="text-muted-foreground">Address: 710 Poeland, Stryker Island</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default ContactPage;
