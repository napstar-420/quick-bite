import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Store,
  MapPin,
  Clock,
  User,
  Users,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCcw,
  Eye
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "../../services/axios";
import { API_ROUTES } from "../../lib/constants";
import BranchDetails from "./branch-details";

export default function RestaurantBranches({ restaurantId }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        // Assuming there's an API endpoint for getting restaurant branches
        // You might need to adjust this based on your actual API structure
        const response = await axios.get(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/branches`);
        setBranches(response.data);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Failed to load restaurant branches");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [restaurantId]);

  const handleViewBranchDetails = (branch) => {
    setSelectedBranch(branch);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <X className="h-8 w-8 text-destructive mb-2" />
        <p className="text-lg font-medium">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Restaurant Branches</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {/* Show the branch details when a branch is selected */}
      {selectedBranch && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBranch(null)}
              >
                <X className="h-4 w-4 mr-2" />
                Close Details
              </Button>
              <h3 className="text-lg font-medium">{selectedBranch.name}</h3>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Branch
            </Button>
          </div>
          <BranchDetails branch={selectedBranch} />
        </div>
      )}

      {branches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Store className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Branches Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              This restaurant doesn't have any branches yet.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Branch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Branches</CardTitle>
            <CardDescription>
              Manage all branches for this restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        {branch.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">
                            {branch.address?.street}, {branch.address?.city}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {branch.address?.state}, {branch.address?.zipCode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {branch.manager || "Not assigned"}
                          </span>
                        </div>
                        {branch.staff && branch.staff.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{branch.staff.length} staff members</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        branch.status === "approved" ? "success" :
                        branch.status === "pending" ? "warning" :
                        branch.status === "rejected" ? "destructive" :
                        branch.status === "closed" ? "secondary" :
                        branch.status === "suspended" ? "outline" :
                        "secondary"
                      }>
                        {branch.status}
                      </Badge>
                      {branch.isActive !== undefined && (
                        <Badge variant={branch.isActive ? "success" : "secondary"} className="ml-2">
                          {branch.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewBranchDetails(branch)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Branch
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Staff
                          </DropdownMenuItem>
                          {branch.status === "pending" && (
                            <>
                              <DropdownMenuItem>
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <X className="h-4 w-4 mr-2 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Branch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
