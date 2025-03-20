import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// TODO: update to use components from components folder
const Suspended = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m0 0V6m0 2h2M9 10h2"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Account Suspended
        </h1>

        <p className="text-gray-600 mb-6">
          Your account has been suspended. Please contact customer support for
          assistance.
        </p>

        <div className="flex flex-col space-y-3">
          <a
            href="mailto:support@quickbite.com"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Contact Support
          </a>

          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suspended;
