import { MenuItemCard } from "../menu-item-card";
import { Separator } from "../ui/separator";

export function MenuSection({ menu, title, branchId }) {
  const sectionTitle = title || menu?.name || "Menu";

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{sectionTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu?.menuItems && menu.menuItems.length > 0 ? (
          menu.menuItems.map((item) => (
            <MenuItemCard
              key={item._id}
              menuItem={{
                ...item,
                restaurant: menu.restaurant?.name,
              }}
              branchId={branchId}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-2">No items in this menu</p>
        )}
      </div>
      <Separator className="mt-6" />
    </div>
  );
}
