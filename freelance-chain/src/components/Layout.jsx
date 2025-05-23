// import { Outlet } from 'react-router-dom';
// import Navbar from '../components/Freelancer/Cards/Navbar';
// import Footer from '../components/Freelancer/Cards/footer';

// const Layout = () => {
//   return (
//     <div className="app-container">
//       <Navbar />
//       <main className="main-content">
//         <Outlet /> {/* This renders the matched child route */}
//       </main>
//       <Footer />
//     </div>
//   );
// };


// export default Layout;

import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Freelancer/Cards/Navbar';
import Footer from '../components/Freelancer/Cards/footer';

const Layout = () => {
  const location = useLocation();

  // List of routes where the footer should be hidden
  const hideFooterRoutes = ['/messages'];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* This renders the matched child route */}
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;