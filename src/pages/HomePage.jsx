import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/NavBar";
import Feed from "../components/home/Feed";
import { getSortedProfiles } from "../utils/compatibility"; // Наш новий файл

const HomePage = () => {
  const { user, userData } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const allUsers = querySnapshot.docs.map(doc => doc.data());

        // Використовуємо наш алгоритм для фільтрації та сортування за сумісністю
        if (userData) {
          const sorted = getSortedProfiles(allUsers, userData);
          setProfiles(sorted);
        }
      } catch (error) {
        console.error("Помилка при завантаженні профілів:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && userData) {
      fetchAndFilter();
    }
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
        backgroundColor: "var(--bg)" 
      }}>
        {loading ? (
          <div className="loader">Зчитуємо зірки... 🌌</div>
        ) : (
          <Feed profiles={profiles} />
        )}
      </main>
    </div>
  );
};

export default HomePage;