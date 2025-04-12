import Image from "next/image";
import { useEffect, useState } from "react";

interface CarouselProps {
    carouselImages: string[]
}

export default function ImageCarousel ({carouselImages}: CarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentImageIndex((prev) => 
            prev === carouselImages.length - 1 ? 0 : prev + 1
          );
        }, 5000); // Change image every 5 seconds
    
        return () => clearInterval(timer);
    }, [carouselImages.length]);
    
      // Navigation handlers
    const goToPrevious = () => {
        setCurrentImageIndex((prev) => 
          prev === 0 ? carouselImages.length - 1 : prev - 1
        );
    };
    
    const goToNext = () => {
        setCurrentImageIndex((prev) => 
          prev === carouselImages.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="relative h-[300px] sm:h-[450px] md:h-[600px] w-full overflow-hidden">
          <div className="relative w-full h-full">
            {carouselImages.map((src, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={src}
                  alt={`carousel-image-${index+1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
    )
}