import { useState, useEffect } from 'react'; // <--- Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ReportPest = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    farmerName: '',
    location: '',
    pestType: 'Locust',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingLocation, setLoadingLocation] = useState(false);

  // --- NEW: Auto-fill Name from Logged-in User ---
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        farmerName: user.name // Pre-fill name
      }));
    } else {
      // If not logged in, redirect to login
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, or GIF)' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage({ type: '', text: '' });
    }
  };

  // Get user location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser' });
      return;
    }
    setLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
        const address = data.address ? `${data.address.village || data.address.town || data.address.city || ''}, ${data.address.state || ''}` : `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
        
        const cleanAddress = address.replace(/^,\s*/, '');
        
        setFormData((prev) => ({
          ...prev,
          location: cleanAddress,
        }));

        setLoadingLocation(false);
        setMessage({ type: 'success', text: 'Location detected successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
          setLoadingLocation(false);
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setMessage({ type: 'error', text: errorMessage });
      }

    }
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to submit a report.' });
      navigate('/login');
      return;
    }

    // Validation (Removed farmerName check since it's auto-filled)
    if (!formData.location || !formData.pestType || !formData.description) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (!image) {
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    const submitData = new FormData();
    submitData.append('farmerName', user.name); // Use user.name from Redux
    submitData.append('location', formData.location);
    submitData.append('pestType', formData.pestType);
    submitData.append('description', formData.description);
    if (image) submitData.append('image', image);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/reports', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`, // Send Token
        },
      });

      setMessage({ type: 'success', text: response.data.message || 'Report submitted successfully!' });
      
      // Reset form (Keep name filled)
      setFormData({
        farmerName: user.name, 
        location: '',
        pestType: 'Locust',
        description: '',
      });
      setImage(null);
      setImagePreview(null);
      
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit report';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6">
          ← Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Report Pest Infestation
          </h1>
          <p className="text-gray-600">
            Help protect our crops by reporting pest activities in your area
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Farmer Name (Read Only) */}
            <div>
              <label htmlFor="farmerName" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name (Auto-filled)
              </label>
              <input
                type="text"
                id="farmerName"
                name="farmerName"
                value={formData.farmerName}
                // Removed onChange because it's disabled
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location or use GPS"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition duration-200 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={loadingLocation}
                  className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingLocation ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><span>📍</span><span className="hidden sm:inline">Get Location</span></>
                  )}
                </button>
              </div>
            </div>

            {/* Pest Type */}
            <div>
              <label htmlFor="pestType" className="block text-sm font-semibold text-gray-700 mb-2">
                Pest Type <span className="text-red-500">*</span>
              </label>
              <select
                id="pestType"
                name="pestType"
                value={formData.pestType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
                required
              >
                <option value="Locust">🦗 Locust</option>
                <option value="Aphid">🐛 Aphid</option>
                <option value="Armyworm">🐛 Armyworm</option>
                <option value="Other">❓ Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the pest infestation..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Image <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                    </div>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden border-2 border-primary-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            {message.text && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPest;