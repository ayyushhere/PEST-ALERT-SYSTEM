import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🌾</span>
              <span className="text-2xl font-bold text-gray-800 hidden sm:block">AgriShield</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
                
                {/* Show Admin Dashboard Link only if Admin */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin"
                    className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={onLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;