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
    <nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl glass shadow-lg border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 transition hover:scale-105 active:scale-95 duration-200">
            <span className="text-3xl filter drop-shadow-md">🌾</span>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 hidden sm:block tracking-tight">
              AgriShield
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="flex flex-col items-end mr-2 hidden md:flex">
                  <span className="text-sm font-semibold text-white/90">{user.name}</span>
                  <span className="text-xs text-white/60 font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/5">{user.role}</span>
                </div>

                {/* Show Admin Dashboard Link only if Admin */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-white/80 hover:text-white font-medium px-4 py-2 rounded-xl hover:bg-white/10 transition duration-200"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={onLogout}
                  className="bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/5 hover:border-red-500/30 px-5 py-2.5 rounded-xl font-medium transition duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 backdrop-blur-md shadow-lg shadow-black/5"
                >
                  <span className="text-lg">🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white font-medium px-4 py-2 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded-xl font-bold transition duration-200 shadow-lg shadow-white/10 transform hover:-translate-y-0.5"
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