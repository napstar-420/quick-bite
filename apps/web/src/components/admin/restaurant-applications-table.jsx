import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { StatusBadge } from "./restaurant-status-badge";

export function RestaurantApplicationsTable({ applications }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2 text-left">Application ID</th>
          <th className="px-4 py-2 text-left">Restaurant Name</th>
          <th className="px-4 py-2 text-left">Cuisine</th>
          <th className="px-4 py-2 text-left">Owner</th>
          <th className="px-4 py-2 text-left">Contact</th>
          <th className="px-4 py-2 text-left">Date</th>
          <th className="px-4 py-2 text-center">Status</th>
          <th className="px-4 py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application.id} className="border-b">
            <td className="px-4 py-3 text-sm">{application.id}</td>
            <td className="px-4 py-3 font-medium">{application.name}</td>
            <td className="px-4 py-3 text-sm">{application.cuisine}</td>
            <td className="px-4 py-3 text-sm">{application.owner}</td>
            <td className="px-4 py-3 text-sm">{application.contact}</td>
            <td className="px-4 py-3 text-sm">{application.applicationDate}</td>
            <td className="px-4 py-3 text-sm text-center">
              <StatusBadge status={application.status} />
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
