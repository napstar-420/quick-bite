export function RestaurantsTable({ restaurants }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Restaurant</th>
          <th className="px-4 py-2 text-left">Cuisine</th>
          <th className="px-4 py-2 text-left">Owner</th>
          <th className="px-4 py-2 text-left">Rating</th>
          <th className="px-4 py-2 text-center">Status</th>
          <th className="px-4 py-2 text-center">Featured</th>
          <th className="px-4 py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {restaurants.map((restaurant) => (
          <tr key={restaurant.id} className="border-b">
            <td className="px-4 py-3 text-sm">{restaurant.id}</td>
            <td className="px-4 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 overflow-hidden rounded-md">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-medium">{restaurant.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm">{restaurant.cuisine}</td>
            <td className="px-4 py-3 text-sm">{restaurant.owner}</td>
            <td className="px-4 py-3 text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                {restaurant.rating}
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-center">
              <StatusBadge status={restaurant.status} />
            </td>
            <td className="px-4 py-3 text-center">
              <Switch checked={restaurant.featured} />
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
