import { useState, useRef, useEffect, useCallback } from 'react';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  const goToSlide = useCallback((index: number) => {
    let newIndex = index;
    if (index < 0) newIndex = images.length - 1;
    if (index >= images.length) newIndex = 0;
    setCurrentIndex(newIndex);
    
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * newIndex;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [images.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = (carouselRef.current.scrollLeft || 0) - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, goToSlide]);

  return (
    <div className="relative z-50 w-full">
      <div 
        ref={carouselRef}
        className="flex overflow-x-hidden scrollbar-none transition-all snap-x snap-mandatory aspect-[3/1] w-full"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {images.map((image, index) => (
          <div 
            key={index} 
            className="max-w-full h-full flex-shrink-0 snap-start"
          >
            <img 
              src={image} 
              alt={`Carousel image ${index}`} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex ? 'bg-nexafit-navbar scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;