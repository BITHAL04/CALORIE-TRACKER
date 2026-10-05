import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';

const Navbar_home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFlushing, setIsFlushing] = useState(false);
    const [isAnimatingClose, setIsAnimatingClose] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isSignedIn } = useAuth();

    const toggleDropdown = () => {
        if (!isOpen) {
        // Opening nav
        setIsFlushing(true);
        setTimeout(() => {
            setIsOpen(true);
            setIsFlushing(false);
        }, 300);
        } else {
        // Closing nav
        setIsClosing(true);
        setIsAnimatingClose(true);
        setIsOpen(false);
    
        // Delay background color removal to match dropdown animation
        setTimeout(() => {
            setIsAnimatingClose(false);
            setIsClosing(false);
        }, 500); // Matches the dropdown transition duration
        }
    };
    
    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsClosing(true);
            setIsAnimatingClose(true);
            setIsOpen(false);
            setTimeout(() => {
            setIsAnimatingClose(false);
            setIsClosing(false);
            }, 500);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative z-50 py-2" ref={dropdownRef}> 
        {/* Container with padding applied to both sections */}
        <div className="px-4">
            {/* Top bar - this maintains constant height */}
            <div
            className={`
                flex justify-between items-center py-2 px-3
                transition-colors duration-500 ease-in-out
                ${isFlushing || isOpen || isAnimatingClose ? 'bg-nexafit-accent text-white' : ''}
                ${isOpen || isAnimatingClose ? 'rounded-t-xl' : 'rounded-xl'}
            `}
            >
            <h1 className="text-4xl font-bold tracking-tight">nexaFit</h1>
            <button
                onClick={toggleDropdown}
                className="p-1 sm:p-2 text-2xl sm:text-3xl focus:outline-none"
                aria-label="Toggle navigation menu"
            >
                ≡
            </button>
            </div>

            {/* Dropdown - positioned absolutely to overlay content */}
            <div
            className={`
                absolute left-4 right-4 bg-nexafit-accent
                ${isOpen || isAnimatingClose ? 'rounded-b-xl' : 'rounded-xl'}
                py-2 md:py-4 px-6 sm:px-10
                transition-all duration-500 ease-in-out shadow-lg
                transform origin-top
                ${isOpen 
                ? 'opacity-100 visible translate-y-0' 
                : 'opacity-0 invisible -translate-y-6 pointer-events-none'}
                animate-slide-down
            `}
            style={{
                transformOrigin: 'top center',
                animation: isOpen ? 'slideDown 0.5s ease forwards' : 'none'
            }}
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0 w-full sm:w-auto">
                        <Link 
                            to="/calorie-tracker" 
                            className="text-nexafit-footer text-sm sm:text-base hover:text-white/80 font-medium text-center sm:text-left"
                        >
                            Calorie Tracker
                        </Link>
                        <Link 
                            to="/meal-planner" 
                            className="text-nexafit-footer text-sm sm:text-base hover:text-white/80 font-medium text-center sm:text-left"
                        >
                            Meal Planner
                        </Link>
                        <Link 
                            to="/forum" 
                            className="text-nexafit-footer text-sm sm:text-base hover:text-white/80 font-medium text-center sm:text-left"
                        >
                            Forum
                        </Link>
                        <Link 
                            to="/contact" 
                            className="text-nexafit-footer text-sm sm:text-base hover:text-white/80 font-medium text-center sm:text-left"
                        >
                            Contact Us
                        </Link>
                        <Link 
                            to="/about" 
                            className="text-nexafit-footer text-sm sm:text-base hover:text-white/80 font-medium text-center sm:text-left"
                        >
                            About Us
                        </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 w-full sm:w-auto sm:ml-auto">
                        
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Navbar_home;