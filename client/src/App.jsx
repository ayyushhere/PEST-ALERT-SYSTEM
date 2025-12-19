import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ReportPest from './pages/ReportPest';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';       
import Register from './pages/Register';
import AlertListener from './components/AlertListener';
import Navbar from './components/Navbar';
import Home from './pages/Home.jsx';
import MyReports from './pages/MyReports';
import ManageUsers from './pages/ManageUsers';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <AlertListener />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />      
            <Route path="/register" element={<Register />} /> 
            <Route path="/report" element={<ReportPest />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
