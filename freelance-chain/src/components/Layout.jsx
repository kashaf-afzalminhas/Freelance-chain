import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import Navbar from '../Freelancer/Cards/Navbar';
import footer from '../Freelancer/Cards/footer';
const Layout = () => {


  return (
    <div className="app-container">
      <Navbar/>
      
      <main className="main-content">
        <Outlet /> {/* This renders the matched child route */}
      </main>
      
      <footer/>
    </div>
  );
};

export default Layout;