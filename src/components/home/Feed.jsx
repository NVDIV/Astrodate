import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import "../../styles/Feed.css";

const Feed = ({ profiles }) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSwipe = useCallback(async (swipeDir) => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    setDirection(swipeDir);

    if (swipeDir === 1) { // LIKE
      await handleLike(currentProfile.uid);
    } else { // NOPE (теж записуємо в базу як переглянутого)
      await handleDislike(currentProfile.uid);
    }

    setTimeout(() => {
      setDirection(0);
      setCurrentIndex((prev) => prev + 1); // Просто йдемо вперед
    }, 300);
  }, [profiles, currentIndex]);

  const handleLike = async (targetUid) => {
    if (!user) return; 
    const myUid = user.uid; 
    try {
      await setDoc(doc(db, "likes", `${myUid}_${targetUid}`), {
        from: myUid, to: targetUid, type: "like", timestamp: Date.now()
      });
      const reverseLikeSnap = await getDoc(doc(db, "likes", `${targetUid}_${myUid}`));
      if (reverseLikeSnap.exists() && reverseLikeSnap.data().type === "like") {
        const matchId = myUid < targetUid ? `${myUid}_${targetUid}` : `${targetUid}_${myUid}`;
        await setDoc(doc(db, "matches", matchId), { users: [myUid, targetUid], timestamp: Date.now() });
        alert("✨ Це зодіакальний метч!");
      }
    } catch (err) { console.error(err); }
  };

  const handleDislike = async (targetUid) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "likes", `${user.uid}_${targetUid}`), {
        from: user.uid, to: targetUid, type: "dislike", timestamp: Date.now()
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handleSwipe(-1);
      if (e.key === "ArrowRight") handleSwipe(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipe]);

  // Стан, коли картки закінчилися
  if (currentIndex >= profiles.length) {
    return (
      <div className="feed-empty-state">
        <span style={{fontSize: "50px"}}>🌌</span>
        <h3>Люди закінчилися</h3>
        <p>Заходьте пізніше, коли зірки приведуть нових користувачів.</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="feed-wrapper">
      <div className="card-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.uid}
            className="tinder-card glass-card"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleSwipe(1);
              else if (info.offset.x < -100) handleSwipe(-1);
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ x: direction * 500, opacity: 0, rotate: direction * 20 }}
          >
            <div className="card-inner">
              <div className="card-image-box">
                <img src={currentProfile.photoURL} alt="User" />
                <div className="card-info-overlay">
                  <div className="info-main">
                    <h2>{currentProfile.firstName}, {calculateAge(currentProfile.birthDate)}</h2>
                    <span className="match-badge">{currentProfile.matchScore}%</span>
                  </div>
                  <p>📍 {currentProfile.city} • {currentProfile.zodiacSign}</p>
                </div>
              </div>
              <div className="card-details">
                <div className="bio-scroll-area">
                  <p className="bio-text">{currentProfile.bio || "Космічна загадка..."}</p>
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