import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // 1. Fetch Users on Load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('http://localhost:5000/api/users', config);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users");
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchUsers();
    } else {
      navigate('/'); // Kick out non-admins
    }
  }, [user, navigate]);

  // 2. Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        
        // Remove from UI immediately without refreshing
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  if (loading) return (
     <div className="min-h-screen pt-24 flex justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
              <p className="text-white/60">Manage system access and registered farmers</p>
            </div>
            <button 
                onClick={() => navigate('/')} 
                className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl hover:bg-white/20 transition duration-200"
            >
                ← Back to Dashboard
            </button>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/10 text-white/70">
              <tr>
                <th className="p-6 font-semibold">Name</th>
                <th className="p-6 font-semibold">Email</th>
                <th className="p-6 font-semibold">Role</th>
                <th className="p-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition duration-150">
                  <td className="p-6 font-medium text-white">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                           {u.name.charAt(0)}
                        </div>
                        {u.name}
                     </div>
                  </td>
                  <td className="p-6 text-white/70">{u.email}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                        {u.role}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {/* Don't allow deleting yourself */}
                    {u._id !== user._id && (
                        <button 
                            onClick={() => handleDelete(u._id)}
                            className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/20 border border-red-500/20 transition"
                        >
                            Delete
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          
          {users.length === 0 && (
            <p className="p-12 text-center text-white/40">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;