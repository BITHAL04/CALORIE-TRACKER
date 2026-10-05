
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface FeatureOverlayProps {
  username: string;
}

const FeatureOverlay = ({ username }: FeatureOverlayProps) => {
  return (
    <div className="bg-nexafit-accent rounded-xl shadow-lg overflow-hidden text-white">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Greeting */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-medium mb-3">
            Hello {username},
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            you being here is a feat in itself.
          </p>

          <div className="flex justify-end md:-mt-12">
                <img
                    loading="lazy"
                    src="/pentacle-spinner.webp"
                    className="object-contain max-w-full aspect-square w-[90px] animate-[spin_4500ms_ease-in-out]"
                    alt=""
                />
            </div>

          <Link
            to="/profile"
            className="flex justify-between items-center group pt-6"
          >
            <div>
              <p className="text-sm opacity-80">Create or update your profile</p>
            </div>
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block w-0.5 bg-nexafit-footer self-stretch mx-1 my-4"></div>

        {/* Right side - Quick links */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col space-y-6">
          <Link
            to="/calorie-tracker"
            className="flex justify-between items-center group"
          >
            <div>
              <h3 className="text-xl font-medium">Here after a workout?</h3>
              <p className="text-sm opacity-80">Check the cals you burnt</p>
            </div>
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>

          <Link
            to="/meal-planner"
            className="flex justify-between items-center group"
          >
            <div>
              <h3 className="text-xl font-medium">Want a tailored meal plan?</h3>
              <p className="text-sm opacity-80">Head over to our meal planner</p>
            </div>
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureOverlay;
