import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [broadcastForm, setBroadcastForm] = useState({ alertMessage: '', severity: 'Medium' });
  const [toastMessage, setToastMessage] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('High');

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if(user){
      fetchReports();
    }

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Admin connected to Socket.IO');
    });

    newSocket.on('new_alert', (alert) => {
      console.log('New alert received:', alert);
      setAlerts((prev) => [alert, ...prev]);
      showToast(`🚨 New Alert: ${alert.alertMessage}`);
      fetchReports();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this report?')) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/reports/${id}`, { status: 'Rejected' }, config);
      fetchReports();
      showToast('Report Rejected');
    } catch (error) {
      showToast('Failed to reject report', true);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // USE THE REAL FARMER IMAGE
      // We assume the server serves uploads statically at /uploads
      const realImage = selectedReport.imageUrl 
        ? `http://localhost:5000${selectedReport.imageUrl}` 
        : 'https://images.unsplash.com/photo-1549419163-e380fb144a49?q=80&w=2670&auto=format&fit=crop';

      await axios.post('http://localhost:5000/api/reports/broadcast', {
        reportId: selectedReport._id,
        alertMessage,
        severity,
        imageUrl: realImage // <-- Sending the ACTUAL proof image
      }, config);

      showToast(`🚨 Alert Broadcasted for ${selectedReport.pestType}!`);
      setSelectedReport(null);
      setAlertMessage('');
      fetchReports();
    } catch (error) {
      console.error(error);
      showToast('Failed to broadcast alert', true);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`, 
      },
    };

      const response = await axios.get('http://localhost:5000/api/reports', config);
      setReports(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, isError = false) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
             <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Admin Dashboard</h1>
             <p className="text-white/60">Manage reports and broadcast alerts</p>
          </div>
        </div>

        {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center">
               <span className="text-5xl font-bold text-white mb-2">{reports.length}</span>
               <span className="text-white/60 font-medium">Total Reports</span>
            </div>
            <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center border-yellow-500/20 bg-yellow-500/5">
                <span className="text-5xl font-bold text-yellow-400 mb-2">
                   {reports.filter(r => r.status === 'Pending').length}
                </span>
                <span className="text-yellow-200/60 font-medium">Pending Review</span>
            </div>
            <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center border-green-500/20 bg-green-500/5">
                 <span className="text-5xl font-bold text-green-400 mb-2">
                   {reports.filter(r => r.status === 'Resolved').length}
                </span>
                <span className="text-green-200/60 font-medium">Resolved & Alerts Sent</span>
            </div>
         </div>

        {/* Reports Table - Simplified List for Mobile, Table for Desktop */}
        <div className="glass-card rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 border-b border-white/10 text-white/70">
                <tr>
                  <th className="p-6 font-semibold">Farmer</th>
                  <th className="p-6 font-semibold">Pest</th>
                  <th className="p-6 font-semibold">Location</th>
                  <th className="p-6 font-semibold">Image</th>
                  <th className="p-6 font-semibold">Status</th>
                  <th className="p-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-white/5 transition duration-150">
                    <td className="p-6 font-medium text-white">{report.farmerName}</td>
                    <td className="p-6 text-white/80">{report.pestType}</td>
                    <td className="p-6 text-sm text-white/60">{report.location}</td>
                    <td className="p-6">
                      <a 
                        href={`http://localhost:5000${report.imageUrl}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-block"
                      >
                         <img 
                           src={`http://localhost:5000${report.imageUrl}`} 
                           alt="Proof" 
                           className="w-12 h-12 rounded-lg object-cover border border-white/20 hover:scale-150 transition-transform duration-200 z-10 relative"
                         />
                      </a>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        report.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        report.status === 'Resolved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-6">
                      {report.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedReport(report)}
                            className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-lg hover:shadow-blue-500/30"
                          >
                            Prepare Alert
                          </button>
                          <button 
                            onClick={() => handleReject(report._id)}
                            className="bg-white/5 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {report.status !== 'Pending' && <span className="text-white/30 text-sm italic">No actions available</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reports.length === 0 && <div className="p-12 text-center text-white/40">No reports found.</div>}
        </div>

        {/* BROADCAST MODAL */}
        {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReport(null)}></div>
            <div className="glass-card bg-[#1e293b]/90 p-8 rounded-3xl w-full max-w-lg relative z-10 shadow-2xl animate-scale-in">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <span className="text-3xl">📢</span> Broadcast Alert
              </h2>
              <p className="mb-6 text-white/70">
                You are issuing an alert for <span className="text-white font-bold">{selectedReport.pestType}</span> reported in <span className="text-white font-bold">{selectedReport.location}</span>.
              </p>
              <form onSubmit={handleBroadcast} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">Alert Message</label>
                  <input 
                    type="text" 
                    value={alertMessage} 
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50" 
                    placeholder="e.g., Immediate spraying required..." 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">Severity Level</label>
                  <select 
                    value={severity} 
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white appearance-none focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="High" className="bg-slate-800 text-red-400">🔴 High Risk</option>
                    <option value="Medium" className="bg-slate-800 text-orange-400">🟠 Medium Risk</option>
                    <option value="Low" className="bg-slate-800 text-green-400">🟢 Low Risk</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setSelectedReport(null)}
                    className="px-6 py-3 text-white/70 hover:bg-white/10 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-red-600/40 transform hover:-translate-y-0.5 transition duration-200"
                  >
                    🚀 Broadcast Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
           <div className="fixed bottom-8 right-8 z-[110] glass-card px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right border-l-4 border-l-blue-500">
              <span className="text-white font-medium">{toastMessage}</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
