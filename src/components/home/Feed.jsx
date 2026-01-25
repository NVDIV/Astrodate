import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Feed.css";

const Feed = ({ profiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 для ліво, 1 для право

  const handleSwipe = useCallback((swipeDir) => {
    setDirection(swipeDir);
    // Даємо час на анімацію відльоту, потім міняємо картку
    setTimeout(() => {
      setDirection(0);
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }, 300);
  }, [profiles.length]);

  // Слухач клавіатури
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handleSwipe(-1);
      if (e.key === "ArrowRight") handleSwipe(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipe]);

  if (profiles.length === 0) return <div className="feed-empty">🌌 Шукаємо людей...</div>;

  const currentProfile = profiles[currentIndex];

  return (
    <div className="feed-wrapper">
      <div className="card-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.uid}
            className="tinder-card"
            // Drag налаштування
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleSwipe(1);
              else if (info.offset.x < -100) handleSwipe(-1);
            }}
            // Спрощена анімація
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
            exit={{ 
              x: direction * 500, 
              opacity: 0, 
              rotate: direction * 15,
              transition: { duration: 0.3 } 
            }}
          >
            <div className="card-inner">
              <div className="card-image-box">
                <img src={currentProfile.photoURL} alt="User" />
                <div className="card-info-overlay">
                  <h2>{currentProfile.firstName}, {currentProfile.zodiacSign}</h2>
                  <p>📍 {currentProfile.city} • {currentProfile.matchScore}%</p>
                </div>
              </div>
              
              <div className="card-details">
                <div className="bio-scroll-area">
                  <p className="bio-text">{currentProfile.bio || "Користувач ще не додав опис"}</p>
                </div>
                
                <div className="feed-actions">
                  <button onClick={() => handleSwipe(-1)} className="circle-btn nope-btn">✖</button>
                  <button onClick={() => handleSwipe(1)} className="circle-btn like-btn">❤</button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="keyboard-hint">← Пропустити | Лайк →</p>
    </div>
  );
};

export default Feed;