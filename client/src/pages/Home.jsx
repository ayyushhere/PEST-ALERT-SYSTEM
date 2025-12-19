import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminView from '../components/AdminView';
import FarmerView from '../components/FarmerView';
import LandingView from '../components/LandingView';

function Home() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
         <LandingView />
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {user.role === 'admin' ? <AdminView user={user} /> : <FarmerView user={user} />}
      </div>
    </div>
  );
}

export default Home;