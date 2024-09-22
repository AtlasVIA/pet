import { useState, useEffect } from 'react';

const useScrolling = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToDonationForm = () => {
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
      setIsScrolling(true);
      const headerOffset = 100;
      const elementPosition = donationForm.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling) {
        const donationForm = document.getElementById('donation-form');
        if (donationForm) {
          const rect = donationForm.getBoundingClientRect();
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            donationForm.classList.add('animate-fade-in-up');
          }
        }
      }
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    isScrolling,
    showScrollTop,
    scrollToDonationForm,
    scrollToTop
  };
};

export default useScrolling;