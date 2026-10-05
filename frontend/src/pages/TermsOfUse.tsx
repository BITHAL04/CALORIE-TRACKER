
import InfoPageLayout from '@/components/layouts/InfoPageLayout';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertTriangle, Shield, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfUse = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <InfoPageLayout
      title="Terms of Use"
      subtitle="Last updated: April 1, 2025"
      className="max-w-4xl mx-auto"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <FileText size={32} className="text-nexafit-accent" />
            <h2 className="text-2xl font-semibold text-nexafit-accent">Introduction</h2>
          </div>
          
          <p className="mb-4">
            Welcome to nexaFit! These Terms of Use govern your access to and use of the nexaFit application,
            including any content, functionality, and services offered through the application.
          </p>
          
          <p className="mb-4">
            By using nexaFit, you accept and agree to be bound by these Terms of Use and our Privacy Policy.
            If you do not agree to these terms, you must not access or use our application.
          </p>
          
          <div className="bg-nexafit-accent/10 p-4 rounded-md mt-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Info size={20} className="mr-2" /> Important Notice
            </h3>
            <p className="text-muted-foreground">
              nexaFit is not a substitute for professional medical advice, diagnosis, or treatment.
              Always seek the advice of your physician or other qualified health provider with any
              questions you may have regarding a medical condition.
            </p>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {/* User Accounts */}
        <section>
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">User Accounts</h2>
            
            <div className="space-y-4">
              <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Account Creation</h3>
                <p className="text-muted-foreground">
                  To use certain features of the application, you must create an account. You agree to provide
                  accurate, current, and complete information during the registration process and to update
                  such information to keep it accurate, current, and complete.
                </p>
              </div>
              
              <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Account Security</h3>
                <p className="text-muted-foreground">
                  You are responsible for safeguarding the password that you use to access the application.
                  We encourage you to use strong passwords and to change them periodically. You agree not to
                  disclose your password to any third party and to take sole responsibility for any activities
                  under your account.
                </p>
              </div>
              
              <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Account Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend your account at any time, without notice,
                  for conduct that we determine to be in violation of these Terms of Use or otherwise harmful
                  to other users or us.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
        
        <Separator className="my-8" />
        
        {/* User Content */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">User Content</h2>
          
          <p className="mb-4">
            Our application may allow you to upload, submit, store, send, or receive content. By providing
            content to nexaFit, you grant us a worldwide, non-exclusive, royalty-free license to use,
            reproduce, modify, adapt, publish, and display such content for the purpose of providing and
            improving our services.
          </p>
          
          <div className="flex items-start gap-4 bg-nexafit-accent/10 p-4 rounded-md">
            <AlertTriangle size={24} className="text-nexafit-accent shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-2">Prohibited Content</h3>
              <p className="text-muted-foreground mb-2">
                You agree not to upload, submit, store, send, or receive any content that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Violates any applicable law or regulation</li>
                <li>Infringes any intellectual property or other rights of any party</li>
                <li>Contains viruses, malware, or other harmful code</li>
                <li>Is defamatory, obscene, offensive, or harassing</li>
                <li>Impersonates any person or entity</li>
                <li>Promotes illegal activities or harm to others</li>
              </ul>
            </div>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">Intellectual Property</h2>
          
          <div className="space-y-4">
            <p>
              The nexaFit application, including all content, features, and functionality, is owned by us,
              our licensors, or other providers and is protected by copyright, trademark, patent, and other
              intellectual property laws.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Trademarks</h3>
                <p className="text-muted-foreground">
                  The nexaFit name, logo, and all related names, logos, product and service names, designs, and
                  slogans are trademarks of nexaFit or its affiliates. You must not use such marks without our
                  prior written permission.
                </p>
              </div>
              
              <div className="bg-nexafit-lightGreen/10 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Copyright</h3>
                <p className="text-muted-foreground">
                  All content included in the application, such as text, graphics, logos, images, videos,
                  and software, is the property of nexaFit or its content suppliers and is protected by
                  copyright laws.
                </p>
              </div>
            </div>
            
            <p>
              You may use the application only for your personal, non-commercial use. Any other use,
              including reproduction, modification, distribution, or republication, without our prior
              written consent, is strictly prohibited.
            </p>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {/* Limitation of Liability */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <Shield size={32} className="text-nexafit-accent" />
            <h2 className="text-2xl font-semibold text-nexafit-accent">Limitation of Liability</h2>
          </div>
          
          <div className="bg-nexafit-accent/10 p-6 rounded-md space-y-4">
            <p>
              <span className="font-medium">No Warranties:</span> The application is provided "as is" and "as available,"
              without any warranties of any kind, either express or implied.
            </p>
            
            <p>
              <span className="font-medium">Disclaimer of Health Advice:</span> nexaFit provides general fitness and
              nutrition information and is not intended as medical advice. We do not guarantee the accuracy,
              completeness, or usefulness of this information.
            </p>
            
            <p>
              <span className="font-medium">Limitation of Liability:</span> To the fullest extent permitted by applicable law,
              in no event will nexaFit, its affiliates, or their licensors, service providers, employees, agents,
              officers, or directors be liable for damages of any kind, including direct, indirect, special,
              incidental, or consequential damages.
            </p>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {/* Modifications to Terms */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">Modifications to Terms</h2>
          
          <p className="mb-4">
            We reserve the right to modify or revise these Terms of Use at any time. If we make material
            changes, we will notify you through the application or by sending an email to the address
            associated with your account.
          </p>
          
          <p>
            Your continued use of nexaFit after any such changes constitutes your acceptance of the new
            Terms of Use. If you do not agree to the modified terms, you should discontinue your use of
            the application.
          </p>
        </section>
        
        <Separator className="my-8" />
        
        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">Governing Law</h2>
          
          <p>
            These Terms of Use and any disputes arising out of or related to these terms or the application
            shall be governed by and construed in accordance with the laws of  Jurisdiction of Bhubaneshwar, Odisha, India, without giving effect to any principles of conflicts of law.
          </p>
        </section>
        
        <Separator className="my-8" />
        
        {/* Contact Us */}
        <section className="bg-gradient-to-r from-nexafit-accent/10 to-nexafit-lightGreen/10 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-nexafit-accent">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Use, please contact us at:
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

export default TermsOfUse;
