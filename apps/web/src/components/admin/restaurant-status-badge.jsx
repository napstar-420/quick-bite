export function StatusBadge({ status }) {
  let color = "";

  switch (status) {
    case "Active":
      color = "bg-green-100 text-green-800";
      break;
    case "Pending":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "Under Review":
      color = "bg-blue-100 text-blue-800";
      break;
    case "Inactive":
      color = "bg-red-100 text-red-800";
      break;
    case "Pending Review":
      color = "bg-purple-100 text-purple-800";
      break;
    case "Document Verification":
      color = "bg-indigo-100 text-indigo-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
};
