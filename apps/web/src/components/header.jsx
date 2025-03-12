import {
  Search,
  Menu,
  MapPin,
  ChevronDown,
  ShoppingBag,
  Ticket,
  HelpCircle,
  LogOut,
  UserRound,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import config from "../config";
import { useAuth } from "../hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useState } from "react";

// TODO: add Address book, Order history, Favorites, Loyalty points
const userDropDownItems = [
  {
    Icon: UserRound,
    label: "Account",
    href: config.ROUTES.ACCOUNT,
  },
  {
    Icon: Ticket,
    label: "Vouchers",
    href: "",
    separator: true,
  },
  {
    Icon: HelpCircle,
    label: "Help",
    href: "",
  },
  {
    Icon: LogOut,
    label: "Logout",
    href: config.ROUTES.LOGOUT,
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <header className="border-b border-gray-200 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-black">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>

          <Link to={config.ROUTES.HOME} className="font-bold text-xl">
            {config.APP_NAME}
          </Link>

          <div className="flex items-center gap-1 ml-4">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">Lahore</span>
            <span className="mx-2 text-gray-400">•</span>
            <div className="flex items-center">
              <span>Now</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search Quick Bite"
              className="pl-10 py-2 bg-gray-100 border-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to={config.ROUTES.CART} className="relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {isAuthenticated ? (
            // TODO: refactor
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <Button asChild variant="outline">
                <DropdownMenuTrigger>
                  <UserRound />
                  {user.name.split(" ")[0]}
                </DropdownMenuTrigger>
              </Button>
              <DropdownMenuContent>
                {userDropDownItems.map((item, index) => (
                  <>
                    <DropdownMenuItem
                      key={index}
                      className="p-0"
                      onClick={handleItemClick}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center gap-2 w-full px-2 py-1.5"
                      >
                        <item.Icon /> {item.label}
                      </Link>
                    </DropdownMenuItem>
                    {item.separator && <DropdownMenuSeparator />}
                  </>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="link"
                className="hover:no-underline font-medium rounded-full"
              >
                <Link to={config.ROUTES.AUTH}>Log in</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="font-medium rounded-full"
              >
                <Link to={config.ROUTES.AUTH}>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
