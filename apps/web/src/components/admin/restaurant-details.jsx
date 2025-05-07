import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Mail, Phone, Globe, DollarSign, Tag } from "lucide-react";

export default function RestaurantDetails({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Restaurant Information</CardTitle>
            <CardDescription>Basic details about the restaurant</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-base">{restaurant.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${restaurant.email}`} className="text-base text-blue-600 hover:underline">
                    {restaurant.email}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${restaurant.phone}`} className="text-base">
                    {restaurant.phone}
                  </a>
                </div>
              </div>

              {restaurant.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="text-base">{restaurant.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price Range</h3>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{restaurant.priceRange || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Owner ID</h3>
                <p className="text-base">{restaurant.owner || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {restaurant.categories && restaurant.categories.length > 0 ? (
                    restaurant.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {typeof category === 'string' ? category : category.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant={
                    restaurant.status === 'approved' ? 'success' :
                    restaurant.status === 'pending' ? 'warning' :
                    restaurant.status === 'under-review' ? 'info' :
                    restaurant.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }>
                    {restaurant.status}
                  </Badge>

                  <Badge variant={restaurant.isActive ? 'success' : 'secondary'}>
                    {restaurant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Media</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-muted-foreground mb-2">Logo</h4>
                {restaurant.logo ? (
                  <div className="relative aspect-square w-40 overflow-hidden rounded-md border">
                    <img
                      src={restaurant.logo}
                      alt={`${restaurant.name} logo`}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-square w-40 bg-muted rounded-md border">
                    <p className="text-xs text-muted-foreground">No logo</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs text-muted-foreground mb-2">Cover Image</h4>
                {restaurant.coverImage ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <img
                      src={restaurant.coverImage}
                      alt={`${restaurant.name} cover`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-video w-full bg-muted rounded-md border">
                    <p className="text-xs text-muted-foreground">No cover image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
