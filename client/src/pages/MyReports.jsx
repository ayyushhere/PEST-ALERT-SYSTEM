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
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 text-white/70 hover:text-white flex items-center gap-2 transition duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition">←</span> Back to Dashboard
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-white tracking-tight">
          My Report History
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center animate-fade-in-up">
            <div className="text-6xl mb-6">📝</div>
            <p className="text-white/60 text-xl mb-8">You haven't reported any issues yet.</p>
            <button 
              onClick={() => navigate('/report')}
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5"
            >
              Submit Your First Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="glass-card p-6 rounded-3xl flex flex-col md:flex-row gap-6 hover:bg-white/10 transition duration-300 animate-fade-in-up md:items-center">
                {/* Image Thumbnail */}
                <div className="w-full md:w-32 h-32 flex-shrink-0 bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                   <img 
                     src={`http://localhost:5000${report.imageUrl}`} 
                     alt="Crop issue" 
                     className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                   />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-xl text-white">{report.pestType}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      report.status === 'Resolved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                      report.status === 'Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2 md:line-clamp-1">{report.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      📅 {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                       📍 {report.location.split(',')[0]}
                    </span>
                  </div>
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