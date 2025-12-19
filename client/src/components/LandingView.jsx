import { Link } from 'react-router-dom';

const LandingView = () => {
    return (
        <div className="pt-20 pb-12">
            {/* Hero Section */}
            <div className="text-center mb-24 relative">
                {/* Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-green-400 text-sm font-bold tracking-wider mb-6 backdrop-blur-md">
                        🚀 NEXT GEN AGRICULTURE
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Protect Your Crops <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            With Smart Intelligence
                        </span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                        AgriShield empowers farmers with real-time pest detection, community alerts, and expert analysis to ensure a healthy, bountiful harvest.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                         <Link 
                            to="/register" 
                            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-600/30 transition transform hover:-translate-y-1 text-lg"
                        >
                            Get Started
                        </Link>
                        <Link 
                            to="/login" 
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-md transition transform hover:-translate-y-1 text-lg"
                        >
                            Login Account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Card 1 */}
                <div className="glass-card p-8 rounded-3xl hover:bg-white/10 transition duration-500 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition duration-300">
                        📡
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Real-time Alerts</h3>
                    <p className="text-white/60 leading-relaxed">
                        Receive instant notifications about pest outbreaks in your vicinity to take preventive action immediately.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="glass-card p-8 rounded-3xl hover:bg-white/10 transition duration-500 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition duration-300">
                        📍
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Precision Geotagging</h3>
                    <p className="text-white/60 leading-relaxed">
                        Pinpoint exact infestation locations using GPS data to create accurate heatmaps of pest activity.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="glass-card p-8 rounded-3xl hover:bg-white/10 transition duration-500 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition duration-300">
                        🛡️
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Expert Analysis</h3>
                    <p className="text-white/60 leading-relaxed">
                        Admins and experts review every report to ensure accuracy and provide tailored solution recommendations.
                    </p>
                </div>
            </div>
            
             {/* Stats/Trust Section (Optional creative addition) */}
            <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                 <div>
                    <div className="text-4xl font-bold text-white mb-1">500+</div>
                    <div className="text-sm text-green-400 uppercase tracking-widest font-bold">Farmers</div>
                 </div>
                 <div>
                    <div className="text-4xl font-bold text-white mb-1">1.2k</div>
                    <div className="text-sm text-blue-400 uppercase tracking-widest font-bold">Reports</div>
                 </div>
                 <div>
                    <div className="text-4xl font-bold text-white mb-1">24/7</div>
                    <div className="text-sm text-purple-400 uppercase tracking-widest font-bold">Monitoring</div>
                 </div>
                 <div>
                    <div className="text-4xl font-bold text-white mb-1">100%</div>
                    <div className="text-sm text-yellow-400 uppercase tracking-widest font-bold">Free</div>
                 </div>
            </div>
        </div>
    );
};

export default LandingView;
