import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

// Створимо заглушки для інших сторінок, щоб додаток не "падав"
const Home = () => <div className="text-white p-10 text-center">Головна (Тут будуть свайпи)</div>;
const Onboarding = () => <div className="text-white p-10 text-center">Заповнення профілю</div>;

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;