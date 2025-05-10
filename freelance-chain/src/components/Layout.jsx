import { Outlet } from 'react-router-dom';
import Navbar from '../components/Freelancer/Cards/Navbar';
import Footer from '../components/Freelancer/Cards/footer';

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* This renders the matched child route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;