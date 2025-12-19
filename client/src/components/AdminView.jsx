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
    <div className="pt-24 pb-12">
      <div className="glass-card rounded-3xl p-8 mb-10 border-l-8 border-blue-500 bg-white/5">
        <div className="flex items-start gap-4">
           <div className="p-3 bg-blue-500/20 rounded-xl text-2xl">👮</div>
           <div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Console</h1>
              <p className="text-white/70 text-lg">
                Overview of system activity, user management, and pest reports.
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Stat Card 1 */}
        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition duration-300">
           <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl mb-4 text-yellow-500">
             ⚠️
           </div>
          <h3 className="text-white/60 text-sm uppercase font-bold tracking-wider mb-2">Pending Reports</h3>
          <p className="text-5xl font-bold text-white">{stats.pendingReports}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition duration-300">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl mb-4 text-green-500">
             👥
           </div>
          <h3 className="text-white/60 text-sm uppercase font-bold tracking-wider mb-2">Total Farmers</h3>
          <p className="text-5xl font-bold text-white">{stats.farmers}</p>
        </div>
        
        {/* Admin Action */}
        <div 
          onClick={() => navigate('/manage-users')}
          className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-600/20 hover:border-blue-500/40 transition duration-300 group"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg shadow-blue-600/30 group-hover:scale-110 transition duration-300">
             ⚙️
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
          <p className="text-white/60 text-sm mb-4">View and manage registered farmers</p>
          <span className="text-blue-400 font-bold group-hover:translate-x-1 transition">Access Panel →</span>
        </div>
      </div>
    </div>
  );
}

export default AdminView;