
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-50 mx-4 mb-4 mt-16">
      <div className="bg-nexafit-footer rounded-xl text-white p-8">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Company Logo */}
          <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-bold">nexaFit</h2>
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-px bg-white/20 mr-8"></div>

          {/* Right side - Links in Columns */}
          <div className="w-full md:w-1/2 grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-3">SERVICES</h3>
              <div className="flex flex-col space-y-2">
                  <Link 
                      to="/calorie-tracker" className="text-sm hover:text-white/80">
                        Calorie Tracker
                  </Link>
                  <Link 
                      to="/meal-planner"  className="text-sm hover:text-white/80">
                        Meal Planner
                  </Link>
                  <Link 
                      to="/help-center" className="text-sm hover:text-white/80">
                        Help Center
                  </Link>
                  <Link 
                      to="/forum" className="text-sm hover:text-white/80">
                        Forum
                  </Link>
              </div>
            </div>

            {/* COMPANY Column */}
            <div>
              <h3 className="font-semibold mb-3">COMPANY</h3>
              <div className="flex flex-col space-y-2">
                  <Link 
                      to="/about" className="text-sm hover:text-white/80">
                        About Us
                  </Link>
                  <Link 
                      to="/contact" className="text-sm hover:text-white/80">
                        Contact Us
                  </Link>
              </div>
            </div>

            {/* LEGAL Column */}
            <div>
              <h3 className="font-semibold mb-3">LEGAL</h3>
              <div className="flex flex-col space-y-2">
                  <Link 
                        to="/privacy" className="text-sm hover:text-white/80">Privacy Policy
                  </Link>
                  <Link 
                        to="/terms" className="text-sm hover:text-white/80">Terms of Use
                  </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border and copyright */}
        <div className="mt-12 pt-6 border-t border-white/20 text-sm opacity-80">
          © 2025 nexaFit.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
