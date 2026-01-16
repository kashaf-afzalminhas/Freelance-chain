import { useLocation, useHistory } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Optional: redirect after a short delay (e.g., 5 seconds)
    setTimeout(() => {
      history.push("/");
    }, 5000);
  }, [location.pathname, history]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-4">
          You will be redirected to the homepage in 5 seconds.
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
