import { useSignoutMutation } from "../../features/auth/authApiSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";

export default function Logout() {
  const [signout] = useSignoutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await signout().unwrap();
      navigate(config.ROUTES.HOME);
    };
    logout();
  }, [signout, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin"></div>
        <p className="text-gray-500">Logging out...</p>
      </div>
    </div>
  );
}
