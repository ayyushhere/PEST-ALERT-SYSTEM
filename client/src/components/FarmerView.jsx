import { Link } from 'react-router-dom';

function FarmerView() {
  return (
    <div className="farmer-dashboard">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
        <p className="font-bold">Farmer Access Granted</p>
        <p>You can report pest issues and view your history here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BIG BUTTON TO REPORT ISSUE */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Report a Pest Outbreak</h2>
          <p className="text-gray-600 mb-4">
            Upload photos and details of pests in your field.
          </p>
          <Link 
            to="/report" 
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Start New Report
          </Link>
        </div>

        {/* View History (Optional) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">My Reports</h2>
          <p className="text-gray-600 mb-4">
            Check status of your previous submissions.
          </p>
          
          <Link to="/my-reports" className="text-green-600 font-semibold hover:underline block text-center mt-2">
            View History  
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FarmerView;