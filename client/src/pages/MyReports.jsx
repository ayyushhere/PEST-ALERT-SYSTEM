import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        // We need to create this specific endpoint in the backend next!
        const response = await axios.get('http://localhost:5000/api/reports/myreports', config);
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyReports();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 text-gray-500 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Report History</h1>

        {loading ? (
          <p>Loading your records...</p>
        ) : reports.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">You haven't reported any issues yet.</p>
            <button 
              onClick={() => navigate('/report')}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Your First Report
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-l-green-500 flex flex-col md:flex-row gap-4">
                {/* Image Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                   <img 
                     src={`http://localhost:5000${report.imageUrl}`} 
                     alt="Crop issue" 
                     className="w-full h-full object-cover"
                   />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{report.pestType}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{report.description}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    Submitted on: {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;