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
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
          Farmer Registration
        </h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              id="name"
              name="name"
              value={name}
              placeholder="Full Name"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              id="email"
              name="email"
              value={email}
              placeholder="Email Address"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              id="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;