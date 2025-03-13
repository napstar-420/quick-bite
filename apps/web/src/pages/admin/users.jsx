import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  MoreVertical,
  Filter,
  X,
  Check,
  ExternalLink,
} from "lucide-react";
import axios from "../../services/axios";
import config from "../../config";
import { API_ROUTES } from "../../lib/constants";
import { formatDate } from "../../lib/utils";
import { toast } from "sonner";

const ITEMS_PER_PAGE = config.PAGINATION.ITEMS_PER_PAGE;

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
        case "active":
          return "bg-green-100 text-green-800";
        case "inactive":
          return "bg-gray-100 text-gray-800";
        case "suspended":
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

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await axios.get(API_ROUTES.GET_USERS, {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
        },
      });

      const { data } = response;
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Something went wrong", {
        description: error.message || error,
      });

      setUsers([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage all users on this platform</CardDescription>
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
                  <label className="text-sm font-medium">
                    Registration Date
                  </label>
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
                      <SelectItem value="inactive">
                        Inactive (30+ days)
                      </SelectItem>
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterStatus("All");
                    setFilterType("All");
                  }}
                >
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
                {users.length && !loading > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-gray-500">
                            {user.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{user.email}</span>
                          <span className="text-xs text-gray-500">
                            {user.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={user.type || "Customer"} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {user.orders || 10}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {formatDate(user.createdAt, {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })}
                          </span>
                          <span className="text-xs text-gray-500">
                            Last active: {formatDate(user.lastActive)}
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
                ) : loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      Loading......
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === page}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
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
                  <p className="text-sm font-medium text-gray-500">
                    Registration Date
                  </p>
                  <p>
                    {formatDate(selectedUser.createdAt, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Active
                  </p>
                  <p>{formatDate(selectedUser.lastActive)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Orders
                  </p>
                  <p>{selectedUser.orders || 10}</p>
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
                Are you sure you want to delete this user? This action cannot be
                undone.
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
              <Button variant="destructive">Delete User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
