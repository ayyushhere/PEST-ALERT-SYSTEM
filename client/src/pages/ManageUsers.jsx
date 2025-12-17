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

  if (loading) return <div className="text-center p-10">Loading Database...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <button 
                onClick={() => navigate('/')} 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
                ← Back to Dashboard
            </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {/* Don't allow deleting yourself */}
                    {u._id !== user._id && (
                        <button 
                            onClick={() => handleDelete(u._id)}
                            className="text-red-500 hover:text-red-700 font-semibold hover:underline"
                        >
                            Delete
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <p className="p-6 text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;