import { Coffee } from "lucide-react";

export function NoRestaurantsPendingApplications() {
  return (
    <div className="py-8 text-center">
      <Coffee className="inline-block w-12 h-12 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium">No pending applications</h3>
      <p className="text-gray-500">
        All restaurant applications have been processed
      </p>
    </div>
  );
}
