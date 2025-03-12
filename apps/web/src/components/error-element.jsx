import React from "react";
import { useRouteError } from "react-router-dom";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const NestedErrorElement = () => {
  const error = useRouteError();
  const errorMessage = error?.message || "An unexpected error occurred";

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 my-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error loading content
          </h3>
          <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 text-red-600 border-red-300 hover:bg-red-100"
              onClick={handleRetry}
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NestedErrorElement;
