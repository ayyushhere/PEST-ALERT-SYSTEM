import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/report');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email, password, role: 'farmer' };
    dispatch(register(userData));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="glass-card p-10 rounded-3xl w-full max-w-md backdrop-blur-xl animate-fade-in-up">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4 text-4xl shadow-inner border border-white/20">
            👨‍🌾
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Join AgriShield
          </h1>
          <p className="text-white/60 text-sm font-medium">
            Create an account to start reporting
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2 ml-1">Full Name</label>
            <input
              type="text"
              className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-green-400/50 transition duration-200"
              id="name"
              name="name"
              value={name}
              placeholder="John Doe"
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-green-400/50 transition duration-200"
              id="email"
              name="email"
              value={email}
              placeholder="name@example.com"
              onChange={onChange}
              required
            />
          </div>
          <div>
             <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-green-400/50 transition duration-200"
              id="password"
              name="password"
              value={password}
              placeholder="••••••••"
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition duration-200"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-white/50">
          Already have an account? 
          <a href="/login" className="ml-2 text-white hover:text-white/80 font-semibold underline decoration-transparent hover:decoration-white transition-all">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;