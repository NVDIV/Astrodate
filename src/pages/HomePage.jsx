import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/NavBar";
import Feed from "../components/home/Feed";
import { getSortedProfiles } from "../utils/compatibility";

const HomePage = () => {
  const { user, userData } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      if (!user || !userData) return;
      
      setLoading(true);
      try {
        // 1. Отримуємо список тих, кого юзер вже лайкав
        const likesQuery = query(collection(db, "likes"), where("from", "==", user.uid));
        const likesSnapshot = await getDocs(likesQuery);
        const viewedUserIds = likesSnapshot.docs.map(doc => doc.data().to);

        // 2. Отримуємо ВСІХ користувачів
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allUsers = usersSnapshot.docs.map(doc => doc.data());

        // 3. Фільтруємо: прибираємо себе + вже переглянутих
        const availableUsers = allUsers.filter(u => 
          u.uid !== user.uid && !viewedUserIds.includes(u.uid)
        );

        // 4. Сортуємо за зірками та статтю
        const sorted = getSortedProfiles(availableUsers, userData);
        setProfiles(sorted);
        
      } catch (error) {
        console.error("Помилка при завантаженні профілів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [user, userData]);

  return (
    <div className="home-page">
      <Navbar />
      <main style={{ 
        paddingTop: "20px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        minHeight: "100vh",
      }}>
        {loading ? (
          <div className="loader" style={{marginTop: "50px"}}>Зчитуємо зірки... 🌌</div>
        ) : (
          <Feed profiles={profiles} />
        )}
      </main>
    </div>
  );
};

export default HomePage;