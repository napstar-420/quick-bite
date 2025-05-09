import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import config from "../config";

export default function NotFound({ backTo }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to={backTo || config.ROUTES.HOME} className="mt-8">
        <Button>Go Back</Button>
      </Link>
    </div>
  );
}
