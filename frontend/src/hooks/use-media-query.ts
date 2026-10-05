
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // For SSR, set initial value based on window object availability
    const getMatches = () => {
      // Check if window is defined (for SSR compatibility)
      if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
      }
      return false;
    };
    
    setMatches(getMatches());
    
    // Create the media query list
    const media = window.matchMedia(query);
    
    // Define a callback function to handle changes
    const listener = () => setMatches(media.matches);
    
    // Add the callback as a listener
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }
    
    // Clean up
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
