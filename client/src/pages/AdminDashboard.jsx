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
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [toastMessage, setToastMessage] = useState('');


  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('High');

  const { user } = useSelector((state) => state.auth);

  // Fetch all reports
  useEffect(() => {
    if(user){
      fetchReports();
    }
    

    // Setup Socket.IO connection for real-time alerts
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Admin connected to Socket.IO');
    });

    newSocket.on('new_alert', (alert) => {
      console.log('New alert received:', alert);
      setAlerts((prev) => [alert, ...prev]);
      // Show toast notification
      showToast(`🚨 New Alert: ${alert.alertMessage}`);
      // Refresh reports to show updated status
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
      fetchReports(); // Refresh UI
      alert('Report Rejected');
    } catch (error) {
      alert('Failed to reject report', error);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Call the Broadcast Endpoint
      await axios.post('http://localhost:5000/api/reports/broadcast', {
        reportId: selectedReport._id,
        alertMessage,
        severity
      }, config);

      alert(`🚨 Alert Broadcasted for ${selectedReport.pestType}!`);
      setSelectedReport(null); // Close Modal
      setAlertMessage('');
      fetchReports(); // Refresh UI (Status becomes 'Resolved')
    } catch (error) {
      console.error(error);
      alert('Failed to broadcast alert');
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);

      const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`, // Safe access with ?.
      },
    };

      const response = await axios.get('http://localhost:5000/api/reports', config);
      setReports(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/reports/${reportId}`, {
        status: newStatus,
      });
      showToast(`Report ${newStatus.toLowerCase()} successfully!`);
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update report status', true);
    }
  };

  const openBroadcastModal = (report) => {
    setSelectedReport(report);
    setBroadcastForm({ 
      alertMessage: `Pest Alert: ${report.pestType} detected in ${report.location}`, 
      severity: 'Medium' 
    });
    setShowBroadcastModal(true);
  };

  const closeBroadcastModal = () => {
    setShowBroadcastModal(false);
    setSelectedReport(null);
    setBroadcastForm({ alertMessage: '', severity: 'Medium' });
  };

  const broadcastAlert = async () => {
    if (!broadcastForm.alertMessage || !broadcastForm.severity) {
      showToast('Alert message and severity are required', true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reports/broadcast', {
        reportId: selectedReport._id,
        alertMessage: broadcastForm.alertMessage,
        severity: broadcastForm.severity,
      });
      showToast('Alert broadcasted successfully!');
      closeBroadcastModal();
      fetchReports();
    } catch (err) {
      console.error('Error broadcasting alert:', err);
      showToast('Failed to broadcast alert', true);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const showToast = (message, isError = false) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Calculate stats
  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'Pending').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Farmer</th>
                <th className="p-4">Pest</th>
                <th className="p-4">Location</th>
                <th className="p-4">Image</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{report.farmerName}</td>
                  <td className="p-4">{report.pestType}</td>
                  <td className="p-4 text-sm text-gray-600">{report.location}</td>
                  <td className="p-4">
                    <a href={`http://localhost:5000${report.imageUrl}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View Img</a>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {report.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Broadcast
                        </button>
                        <button 
                          onClick={() => handleReject(report._id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && <div className="p-8 text-center text-gray-500">No reports found.</div>}
        </div>

        {/* BROADCAST MODAL */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">📢 Broadcast Alert</h2>
              <p className="mb-4 text-sm text-gray-600">
                You are issuing an alert for <b>{selectedReport.pestType}</b> reported by {selectedReport.farmerName}.
              </p>
              <form onSubmit={handleBroadcast}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Alert Message</label>
                  <input 
                    type="text" 
                    value={alertMessage} 
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="w-full border p-2 rounded" 
                    placeholder="e.g., Immediate spraying required..." 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Severity</label>
                  <select 
                    value={severity} 
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="High">🔴 High Risk</option>
                    <option value="Medium">🟠 Medium Risk</option>
                    <option value="Low">🟢 Low Risk</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    🚀 Send Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
