import React, { useState } from 'react';

interface Slide {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

interface SlideData {
  presentationTitle: string;
  date: string;
  slides: Slide[];
}

interface TeamSyncSlidesProps {
  slideData: SlideData;
}

const TeamSyncSlides20251006: React.FC<TeamSyncSlidesProps> = ({ slideData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slideData.slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slideData.slides.length - 1 : prevIndex - 1
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (slideData.slides.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">No slides available</h2>
        <p className="text-gray-500 mt-2">No presentation slides were found for this meeting.</p>
      </div>
    );
  }

  const currentSlide = slideData.slides[currentIndex];

  return (
    <div className={`bg-white rounded-lg shadow-md ${isFullscreen ? 'fixed inset-0 z-50' : 'p-6'}`}>
      <div className={`${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        <div className={`border-b border-gray-200 pb-4 ${isFullscreen ? 'm-6' : 'mb-6'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{slideData.presentationTitle}</h1>
              <p className="text-gray-600 mt-1">{slideData.date}</p>
            </div>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col items-center justify-center ${isFullscreen ? 'm-6' : ''}`}>
          <div className="relative w-full max-w-4xl">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={currentSlide.imageUrl} 
                alt={currentSlide.title}
                className="w-full h-96 object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-gray-800">{currentSlide.title}</h3>
              <p className="text-gray-600 mt-2">{currentSlide.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600">
              {currentIndex + 1} of {slideData.slides.length}
            </span>
            <button
              onClick={nextSlide}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>

          <div className="mt-6 flex space-x-2">
            {slideData.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSyncSlides20251006;