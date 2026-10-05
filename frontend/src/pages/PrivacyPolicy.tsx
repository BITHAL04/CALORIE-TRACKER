
import InfoPageLayout from '@/components/layouts/InfoPageLayout';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Shield, ShieldCheck, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const PrivacyPolicy = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <InfoPageLayout
      title="Privacy Policy"
      subtitle="Last updated: April 1, 2025"
      className="max-w-4xl mx-auto"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck size={32} className="text-nexafit-accent" />
            <h2 className="text-2xl font-semibold text-nexafit-accent">Introduction</h2>
          </div>
          <p className="mb-4">
            At nexaFit, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our application.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using nexaFit, you acknowledge 
            that you have read, understood, and agree to be bound by all the terms outlined in this policy.
          </p>
        </section>
        
        <Separator className="my-8" />
        
        {/* Information We Collect */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <Eye size={32} className="text-nexafit-accent" />
            <h2 className="text-2xl font-semibold text-nexafit-accent">Information We Collect</h2>
          </div>
          
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <p className="text-muted-foreground">
                When you create an account, we may collect your name, email address, and profile information.
              </p>
            </div>
            
            <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Health & Fitness Data</h3>
              <p className="text-muted-foreground">
                To provide personalized recommendations, we collect information such as:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Height, weight, age, and gender</li>
                <li>Fitness goals and activity levels</li>
                <li>Workout data and calorie information</li>
                <li>Dietary preferences and restrictions</li>
              </ul>
            </div>
            
            <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Usage Information</h3>
              <p className="text-muted-foreground">
                We collect information about how you interact with our application, including:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Features you use and time spent on different pages</li>
                <li>Device information (type, operating system, browser)</li>
                <li>IP address and general location data</li>
                <li>Error logs and performance data</li>
              </ul>
            </div>
          </motion.div>
        </section>
        
        <Separator className="my-8" />
        
        {/* How We Use Your Information */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <Shield size={32} className="text-nexafit-accent" />
            <h2 className="text-2xl font-semibold text-nexafit-accent">How We Use Your Information</h2>
          </div>
          
          <p className="mb-4">We use the information we collect for various purposes, including:</p>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-nexafit-accent text-white flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-medium">Providing and Improving Our Services</h3>
                <p className="text-muted-foreground">
                  To deliver the core functionality of nexaFit, including personalized meal plans and calorie predictions,
                  and to enhance and improve these features over time.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-nexafit-accent text-white flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-medium">Personalization</h3>
                <p className="text-muted-foreground">
                  To tailor our content and recommendations to your specific fitness goals, dietary preferences,
                  and health profile.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-nexafit-accent text-white flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-medium">Communication</h3>
                <p className="text-muted-foreground">
                  To respond to your inquiries, provide customer support, and send important updates about
                  our services or your account.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-nexafit-accent text-white flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-medium">Analytics and Research</h3>
                <p className="text-muted-foreground">
                  To understand how our application is used, identify trends, and develop new features
                  that better serve our users' needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {/* Data Security */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <ShieldAlert size={32} className="text-nexafit-accent" />
            <h2 className="text-2xl font-semibold text-nexafit-accent">Data Security</h2>
          </div>
          
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect the security,
            confidentiality, and integrity of your personal data. These measures include:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-nexafit-accent/10 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Encryption</h3>
              <p className="text-muted-foreground">
                All data transmitted between your device and our servers is encrypted using industry-standard
                TLS/SSL protocols.
              </p>
            </div>
            
            <div className="bg-nexafit-accent/10 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Access Controls</h3>
              <p className="text-muted-foreground">
                We restrict access to personal information to authorized employees who need this information
                to perform their job functions.
              </p>
            </div>
            
            <div className="bg-nexafit-accent/10 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Regular Audits</h3>
              <p className="text-muted-foreground">
                We conduct regular security assessments and audits to ensure our systems remain secure
                and up-to-date with the latest security practices.
              </p>
            </div>
            
            <div className="bg-nexafit-accent/10 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Data Minimization</h3>
              <p className="text-muted-foreground">
                We only collect the data we need to provide our services and delete it when it's no
                longer necessary.
              </p>
            </div>
          </div>
          
          <p>
            Despite our efforts, no method of electronic transmission or storage is 100% secure.
            We cannot guarantee absolute security of your data, but we continuously strive to implement
            and improve our security measures.
          </p>
        </section>
        
        <Separator className="my-8" />
        
        {/* Your Privacy Rights */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <EyeOff size={32} className="text-nexafit-accent" />
            <h2 className="text-2xl font-semibold text-nexafit-accent">Your Privacy Rights</h2>
          </div>
          
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-nexafit-lightGreen text-white flex items-center justify-center shrink-0 text-sm">
                ✓
              </div>
              <p><span className="font-medium">Access:</span> You can request a copy of the personal information we hold about you.</p>
            </div>
            
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-nexafit-lightGreen text-white flex items-center justify-center shrink-0 text-sm">
                ✓
              </div>
              <p><span className="font-medium">Correction:</span> You can request that we correct any inaccurate information.</p>
            </div>
            
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-nexafit-lightGreen text-white flex items-center justify-center shrink-0 text-sm">
                ✓
              </div>
              <p><span className="font-medium">Deletion:</span> You can request that we delete your personal information.</p>
            </div>
            
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-nexafit-lightGreen text-white flex items-center justify-center shrink-0 text-sm">
                ✓
              </div>
              <p><span className="font-medium">Restriction:</span> You can request that we restrict the processing of your data.</p>
            </div>
            
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-nexafit-lightGreen text-white flex items-center justify-center shrink-0 text-sm">
                ✓
              </div>
              <p><span className="font-medium">Portability:</span> You can request a copy of your data in a structured, commonly used format.</p>
            </div>
          </div>
          
          <p>
            To exercise any of these rights, please contact us at privacy@nexafit.com. We will respond
            to your request within 30 days.
          </p>
        </section>
        
        <Separator className="my-8" />
        
        {/* Updates to This Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">Updates to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other
            operational, legal, or regulatory reasons. We will notify you of any material changes by:
          </p>
          <ul className="list-disc pl-6 mb-4 text-muted-foreground">
            <li>Posting the updated policy on our application</li>
            <li>Sending an email to the address associated with your account</li>
            <li>Displaying a prominent notice within the application</li>
          </ul>
          <p>
            Your continued use of nexaFit after such modifications will constitute your acknowledgment of the
            modified Privacy Policy and agreement to be bound by its terms.
          </p>
        </section>
        
        <Separator className="my-8" />
        
        {/* Contact Us */}
        <section className="bg-gradient-to-r from-nexafit-accent/10 to-nexafit-lightGreen/10 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">Contact Us</h2>
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <div className="font-medium">
              <p className="text-muted-foreground">Email: nexafit.devs@gmail.com</p>
              <p className="text-muted-foreground">Phone: +91 7978268815</p>
              <p className="text-muted-foreground">Address: 710 Poeland, Stryker Island</p>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default PrivacyPolicy;
