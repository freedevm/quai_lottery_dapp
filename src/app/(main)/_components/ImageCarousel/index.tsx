'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { carouselImages } from '@/lib/constants/carouselImages';

export default function ImageCarousel () {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Responsive perView based on window size
  useEffect(() => {
    const updatePerView = () => {
      if (window.innerWidth <= 768) {
        setPerView(1);
      } else if (window.innerWidth <= 1024) {
        setPerView(2);
      } else if (window.innerWidth <= 1280) {
        setPerView(3);
      } else {
        setPerView(3);
      }
    };

    updatePerView();
    window.addEventListener('resize', updatePerView);
    return () => window.removeEventListener('resize', updatePerView);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= carouselImages.length - perView ? 0 : prev + 1
      );
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused, perView, carouselImages.length]);

  const handlePrev = () => {
    setIsPaused(true);
    setCurrentIndex((prev) =>
      prev === 0 ? carouselImages.length - perView : prev - 1
    );
    // Resume auto-slide after 5 seconds of inactivity
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) =>
      prev >= carouselImages.length - perView ? 0 : prev + 1
    );
    // Resume auto-slide after 5 seconds of inactivity
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <div className="relative px-1 py-8 sm:px-2 md:px-3 w-full">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * (100 / perView)}%` }}
          // transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {carouselImages.map((block) => (
            <div
              key={block.id}
              className={`flex-shrink-0 px-4`}
              style={{ width: `${100 / perView}%` }}
            >
              <div className="relative flex h-48 items-center justify-center rounded-3xl shadow-xl/30 transition-transform duration-300 ease-in-out">
                <Image
                  src={block.imageUrl}
                  alt={block.alt}
                  width={640}
                  height={640}
                  className="h-full w-full rounded-3xl object-cover"
                  priority={block.id === '1'} // Optimize first image
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 transform"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300">
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-2xl text-red-200"
          />
        </div>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 transform"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300">
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-2xl text-red-200"
          />
        </div>
      </button>
    </div>
  );
};
