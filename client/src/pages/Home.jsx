import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdminView from '../components/AdminView';   // You need to create this
import FarmerView from '../components/FarmerView'; // You need to create this

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Get user from Redux state
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // 2. Security Check: If no user is logged in, kick them out
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Prevent rendering if user is null (avoids crashing before redirect happens)
  if (!user) return null; 

  return (
    <div className="dashboard-container">
      {/* Shared Navbar can go here */}
     

      <div className="container mx-auto px-4">
        {/* 3. CONDITIONAL RENDERING */}
        
        {user.role === 'admin' ? (
          /* IF ADMIN: Show the Admin Component */
          <AdminView user={user} />
        ) : (
          /* IF FARMER: Show the Farmer Component */
          <FarmerView user={user} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;