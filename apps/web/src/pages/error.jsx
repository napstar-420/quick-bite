import React from "react";
import { useRouteError } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "../components/ui/button";
import { Home, RefreshCcw } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();

  // Extract error information
  const errorMessage = error?.message || "An unexpected error occurred";
  const errorStatus = error?.status || 500;
  const errorStatusText = error?.statusText || "Internal Server Error";

  // Function to handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  // Function to navigate home
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle className="text-xl font-bold">
            {errorStatus} {errorStatusText}
          </AlertTitle>
          <AlertDescription className="mt-2">{errorMessage}</AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              What might have happened?
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  The page you were looking for might have been moved or deleted
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>There might be a typo in the URL</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The server might be experiencing issues</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRefresh}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button className="flex-1" onClick={handleGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
