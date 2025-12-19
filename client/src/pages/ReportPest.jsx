import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        farmerName: user.name
      }));
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to submit a report.' });
      navigate('/login');
      return;
    }

    if (!formData.location || !formData.pestType || !formData.description) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (!image) {
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    const submitData = new FormData();
    submitData.append('farmerName', user.name);
    submitData.append('location', formData.location);
    submitData.append('pestType', formData.pestType);
    submitData.append('description', formData.description);
    if (image) submitData.append('image', image);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/reports', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      setMessage({ type: 'success', text: response.data.message || 'Report submitted successfully!' });

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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto backdrop-blur-3xl">
        <div className="glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up">

          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Report Pest Infestation
              </h1>
              <p className="text-white/60 text-lg">
                Help protect our crops by reporting pest activities
              </p>
            </div>
            <div className="hidden sm:block w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-green-500/30">
              🌾
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">Your Name</label>
                  <input
                    type="text"
                    value={formData.farmerName}
                    disabled
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter location or use GPS"
                      className="flex-1 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-green-400/50 transition duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loadingLocation}
                      className="px-5 py-3.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 rounded-2xl transition duration-200 disabled:opacity-50 flex items-center justify-center min-w-[60px]"
                      title="Get Current Location"
                    >
                      {loadingLocation ? (
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-xl">📍</span>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                    Pest Type <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="pestType"
                      value={formData.pestType}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white appearance-none focus:bg-white/10 focus:ring-2 focus:ring-green-400/50 transition duration-200"
                      required
                    >
                      <option value="Locust" className="bg-slate-800">🦗 Locust</option>
                      <option value="Aphid" className="bg-slate-800">🐛 Aphid</option>
                      <option value="Armyworm" className="bg-slate-800">🐛 Armyworm</option>
                      <option value="Other" className="bg-slate-800">❓ Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-white/50">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the pest infestation details..."
                    rows="5"
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-green-400/50 resize-none transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                    Evidence Image <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition duration-300 overflow-hidden ${imagePreview
                          ? 'border-green-500/50 bg-black/20'
                          : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                        }`}
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                            <span className="text-white font-medium">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-white/50">
                          <span className="text-3xl mb-2">📸</span>
                          <p className="text-sm font-medium">Click or Drag to upload</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {message.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                  ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                  : 'bg-red-500/20 text-red-200 border border-red-500/30'
                }`}>
                <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-green-500/30 hover:scale-[1.01] active:scale-[0.99] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Submit Report'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPest;