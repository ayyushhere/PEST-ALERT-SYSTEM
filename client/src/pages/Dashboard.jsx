import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

// Import the two different views (we will create these next)
import AdminView from '../components/AdminView';
import FarmerView from '../components/FarmerView';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Get the user from Redux
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  useEffect(() => {
    // 2. Security: If not logged in, kick them out
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Prevent crash while checking user
  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- SHARED NAVBAR --- */}
      <nav className="bg-white shadow-sm p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-700">AgriShield</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, {user.name}</span>
          <button 
            onClick={onLogout} 
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* --- THE LOGIC SWITCH --- */}
      <div className="container mx-auto px-4">
        {user.role === 'admin' ? (
          <AdminView />   /* Admins see this */
        ) : (
          <FarmerView />  /* Farmers see this */
        )}
      </div>
    </div>
  );
}

export default Dashboard;