import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Freelancer/Cards/Navbar';
import Footer from '../components/Freelancer/Cards/footer';
import { useEffect, useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  // Check if the current path starts with any of the routes where footer should be hidden
  const shouldHideFooter = location.pathname.startsWith('/messages');

  return (
    <div className="app-container min-h-screen flex flex-col">
      <Navbar />
      <main className={`main-content flex-grow ${isAdmin ? 'pt-0' : ''}`}>
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
