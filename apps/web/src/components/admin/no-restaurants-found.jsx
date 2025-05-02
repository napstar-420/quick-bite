import { Coffee } from "lucide-react";

export function NoRestaurantsFound() {
  return (
    <div className="py-8 text-center">
      <Coffee className="inline-block w-12 h-12 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium">No restaurants found</h3>
      <p className="text-gray-500">Try adjusting your filters or search term</p>
    </div>
  );
}
