import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { user } = useSelector((state) => state.auth);
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto glass border-t border-white/10 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    
                    {/* Brand & Copyright */}
                    <div className="text-center md:text-left">
                         <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                            <span className="text-2xl">🌾</span>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-500">
                                AgriShield
                            </span>
                        </div>
                        <p className="text-white/40 text-sm">
                            © {currentYear} Smart Pest Defense System.
                        </p>
                    </div>

                    {/* Role-Based Links */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-white/60 hover:text-green-400 transition text-sm">Farmer Login</Link>
                                <Link to="/login" className="text-white/60 hover:text-blue-400 transition text-sm">Admin Access</Link>
                                <a href="#" className="text-white/60 hover:text-white transition text-sm">Help Center</a>
                            </>
                        ) : user.role === 'admin' ? (
                            <>
                                <Link to="/admin" className="text-white/60 hover:text-blue-400 transition text-sm">Dashboard</Link>
                                <Link to="/manage-users" className="text-white/60 hover:text-blue-400 transition text-sm">User Management</Link>
                                <a href="#" className="text-white/60 hover:text-white transition text-sm">System Status</a>
                                <a href="#" className="text-white/60 hover:text-white transition text-sm">Audit Logs</a>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="text-white/60 hover:text-green-400 transition text-sm">Dashboard</Link>
                                <Link to="/report" className="text-white/60 hover:text-green-400 transition text-sm">Report Pest</Link>
                                <Link to="/my-reports" className="text-white/60 hover:text-green-400 transition text-sm">My Reports</Link>
                                <a href="#" className="text-white/60 hover:text-white transition text-sm">Weather Support</a>
                            </>
                        )}
                    </div>

                    {/* Social / Contact */}
                    <div className="flex gap-4">
                        <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition">
                            <span className="sr-only">Twitter</span>
                            🐦
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition">
                            <span className="sr-only">GitHub</span>
                            🐙
                        </a>
                         <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition">
                            <span className="sr-only">Email</span>
                            📧
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
