import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminView() {
    const [stats, setStats] = useState({
    farmers: 0,
    pendingReports: 0
    });

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, // Send the token!
          },
        };
        
        // 2. Call the new endpoint
        const response = await axios.get('http://localhost:5000/api/users/stats', config);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, [user.token]);

  return (
    <div className="admin-dashboard">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
        <p className="font-bold">Admin Console</p>
        <p>Manage users and review outbreak reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-500 text-sm uppercase">Pending Reports</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.pendingReports}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-500 text-sm uppercase">Total Farmers</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.farmers}</p>
        </div>
        
        {/* Admin Action */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <button onClick={() => navigate('/manage-users')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Manage User
            </button>
        </div>
      </div>
    </div>
  );
}

export default AdminView;