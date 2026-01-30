import React, { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Navbar from "../components/layout/NavBar";
import "../styles/Matches.css";

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const myUid = auth.currentUser.uid;
      const q = query(collection(db, "matches"), where("users", "array-contains", myUid));
      
      const querySnapshot = await getDocs(q);
      const matchesData = [];

      for (const matchDoc of querySnapshot.docs) {
        const partnerUid = matchDoc.data().users.find(id => id !== myUid);
        const partnerSnap = await getDoc(doc(db, "users", partnerUid));
        if (partnerSnap.exists()) {
          matchesData.push({ id: matchDoc.id, ...partnerSnap.data() });
        }
      }
      setMatches(matchesData);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="matches-container">
        <h1>Ваші Метчі ✨</h1>
        {loading ? <p>Шукаємо ваші зорі...</p> : (
          <div className="matches-grid">
            {matches.length > 0 ? matches.map(partner => (
              <div key={partner.id} className="match-card">
                <img src={partner.photoURL} alt={partner.firstName} />
                <div className="match-info">
                  <h3>{partner.firstName} ({partner.zodiacSign})</h3>
                  <a 
                    href={`https://t.me/${partner.telegram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="tg-link"
                  >
                    Написати в Telegram
                  </a>
                </div>
              </div>
            )) : <p>Метчів поки немає. Спробуйте більше лайкати!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;