import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { Badge } from "../../components/ui/badge";
import { Search, MoreVertical, Filter, UserPlus, X, Check, Star, ExternalLink } from "lucide-react";

// Sample user data (would come from API in a real application)
const dummyUsers = [
  {
    id: "USR001",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 123-4567",
    registrationDate: "2025-01-15",
    lastActive: "2025-03-10",
    status: "Active",
    type: "Customer",
    orders: 42
  },
  {
    id: "USR002",
    name: "James Smith",
    email: "james.smith@example.com",
    phone: "+1 (555) 987-6543",
    registrationDate: "2025-01-20",
    lastActive: "2025-03-11",
    status: "Active",
    type: "Customer",
    orders: 28
  },
  {
    id: "USR003",
    name: "Olivia Thompson",
    email: "olivia.t@example.com",
    phone: "+1 (555) 456-7890",
    registrationDate: "2025-02-02",
    lastActive: "2025-02-28",
    status: "Inactive",
    type: "Customer",
    orders: 8
  },
  {
    id: "USR004",
    name: "William Johnson",
    email: "william.j@example.com",
    phone: "+1 (555) 567-8901",
    registrationDate: "2025-02-10",
    lastActive: "2025-03-09",
    status: "Active",
    type: "Customer",
    orders: 15
  },
  {
    id: "USR005",
    name: "Sofia Garcia",
    email: "sofia.g@example.com",
    phone: "+1 (555) 234-5678",
    registrationDate: "2025-02-15",
    lastActive: "2025-03-12",
    status: "Active",
    type: "Customer",
    orders: 31
  },
  {
    id: "USR006",
    name: "Benjamin Miller",
    email: "ben.miller@example.com",
    phone: "+1 (555) 345-6789",
    registrationDate: "2025-02-18",
    lastActive: "2025-03-01",
    status: "Suspended",
    type: "Customer",
    orders: 4
  },
  {
    id: "USR007",
    name: "Isabella Davis",
    email: "isabella.d@example.com",
    phone: "+1 (555) 765-4321",
    registrationDate: "2025-02-23",
    lastActive: "2025-03-11",
    status: "Active",
    type: "Customer",
    orders: 19
  },
  {
    id: "RES001",
    name: "Fresh Bites Restaurant",
    email: "contact@freshbites.com",
    phone: "+1 (555) 111-2222",
    registrationDate: "2025-01-10",
    lastActive: "2025-03-12",
    status: "Active",
    type: "Restaurant",
    orders: 278
  },
  {
    id: "DEL001",
    name: "Michael Brooks",
    email: "michael.b@example.com",
    phone: "+1 (555) 444-3333",
    registrationDate: "2025-01-05",
    lastActive: "2025-03-12",
    status: "Active",
    type: "Delivery",
    orders: 156
  },
  {
    id: "RES002",
    name: "Spice House",
    email: "info@spicehouse.com",
    phone: "+1 (555) 222-9999",
    registrationDate: "2025-02-08",
    lastActive: "2025-03-10",
    status: "Active",
    type: "Restaurant",
    orders: 187
  }
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on search query and filters
  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    const matchesType = filterType === "All" || user.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Open user details/edit dialog
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "Active":
          return "bg-green-100 text-green-800";
        case "Inactive":
          return "bg-gray-100 text-gray-800";
        case "Suspended":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <Badge variant="outline" className={`${getStatusStyles()}`}>
        {status}
      </Badge>
    );
  };

  // Type badge component
  const TypeBadge = ({ type }) => {
    const getTypeStyles = () => {
      switch (type) {
        case "Customer":
          return "bg-blue-100 text-blue-800";
        case "Restaurant":
          return "bg-amber-100 text-amber-800";
        case "Delivery":
          return "bg-purple-100 text-purple-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <Badge variant="outline" className={`${getTypeStyles()}`}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage users, restaurants, and delivery personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col space-y-3 mb-4 md:flex-row md:space-y-0 md:space-x-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search users by name, email, or ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Customer">Customers</SelectItem>
                  <SelectItem value="Restaurant">Restaurants</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="p-4 mb-4 bg-gray-50 rounded-md border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Filter Options</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Registration Date</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="quarter">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Activity</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All users</SelectItem>
                      <SelectItem value="active">Active recently</SelectItem>
                      <SelectItem value="inactive">Inactive (30+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Orders</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any number</SelectItem>
                      <SelectItem value="none">No orders</SelectItem>
                      <SelectItem value="1-5">1-5 orders</SelectItem>
                      <SelectItem value="6-20">6-20 orders</SelectItem>
                      <SelectItem value="20+">20+ orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => {
                  setFilterStatus("All");
                  setFilterType("All");
                }}>
                  Reset
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-gray-500">{user.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{user.email}</span>
                          <span className="text-xs text-gray-500">{user.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={user.type} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {user.orders}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{user.registrationDate}</span>
                          <span className="text-xs text-gray-500">
                            Last active: {user.lastActive}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleUserClick(user)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "Active" ? (
                              <DropdownMenuItem className="text-amber-600">
                                Suspend User
                              </DropdownMenuItem>
                            ) : user.status === "Suspended" ? (
                              <DropdownMenuItem className="text-green-600">
                                Reactivate User
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteClick(user)}
                            >
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === page}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedUser.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.id}</p>
                </div>
                <div className="flex flex-col items-end">
                  <TypeBadge type={selectedUser.type} />
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Registration Date</p>
                  <p>{selectedUser.registrationDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Active</p>
                  <p>{selectedUser.lastActive}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p>{selectedUser.orders}</p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex space-x-2 mt-2">
                  {selectedUser.status === "Active" ? (
                    <Button variant="outline" className="text-amber-600">
                      Suspend User
                    </Button>
                  ) : selectedUser.status === "Suspended" ? (
                    <Button variant="outline" className="text-green-600">
                      <Check className="mr-2 h-4 w-4" />
                      Reactivate User
                    </Button>
                  ) : null}

                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Orders
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setIsUserDialogOpen(false)}
              >
                Close
              </Button>
              <Button>Edit User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedUser && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center p-3 border rounded-md bg-gray-50">
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <div className="flex space-x-2 mt-1">
                    <TypeBadge type={selectedUser.type} />
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive">
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
