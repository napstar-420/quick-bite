import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Calendar,
  User,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  RefreshCcw,
  X,
  Search,
  Filter,
  MessageSquare
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "../../services/axios";
import { API_ROUTES } from "../../lib/constants";

// Helper function to render stars
const RatingStars = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function RestaurantReviews({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Assuming there's an API endpoint for getting restaurant reviews
        const response = await axios.get(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load restaurant reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  const handleFlagReview = async (reviewId) => {
    try {
      await axios.patch(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/reviews/${reviewId}/flag`);
      // Update the local state
      setReviews(reviews.map(review =>
        review._id === reviewId ? { ...review, isFlagged: true } : review
      ));
    } catch (err) {
      console.error("Error flagging review:", err);
      // You could add a toast notification here
    }
  };

  const handleRemoveReview = async (reviewId) => {
    try {
      await axios.delete(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/reviews/${reviewId}`);
      // Update the local state
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      console.error("Error removing review:", err);
      // You could add a toast notification here
    }
  };

  // Filter reviews based on search query and rating filter
  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      (review.comment && review.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (review.userName && review.userName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (ratingFilter === "all") return matchesSearch;
    if (ratingFilter === "positive") return matchesSearch && review.rating >= 4;
    if (ratingFilter === "neutral") return matchesSearch && review.rating >= 2.5 && review.rating < 4;
    if (ratingFilter === "negative") return matchesSearch && review.rating < 2.5;

    return matchesSearch;
  });

  // Calculate average rating
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

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
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{averageRating}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(review => Math.floor(review.rating) === rating).length;
              const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3.5 w-3.5 ml-1 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Review Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Total Reviews</p>
                <p className="text-lg font-semibold">{reviews.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Positive (4-5★)</p>
                <p className="text-lg font-semibold">
                  {reviews.filter(review => review.rating >= 4).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Neutral (3★)</p>
                <p className="text-lg font-semibold">
                  {reviews.filter(review => review.rating >= 2.5 && review.rating < 4).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Negative (1-2★)</p>
                <p className="text-lg font-semibold">
                  {reviews.filter(review => review.rating < 2.5).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="positive">Positive (4-5★)</SelectItem>
              <SelectItem value="neutral">Neutral (3★)</SelectItem>
              <SelectItem value="negative">Negative (1-2★)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Reviews Found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {searchQuery || ratingFilter !== "all"
                ? "No reviews match your current filters."
                : "This restaurant doesn't have any reviews yet."}
            </p>
            {(searchQuery || ratingFilter !== "all") && (
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setRatingFilter("all");
              }}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Review List</CardTitle>
            <CardDescription>
              Manage all reviews for this restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review._id} className={review.isFlagged ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{review.userName || 'Anonymous'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={review.rating} />
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-2">
                        {review.comment || <span className="text-muted-foreground italic">No comment</span>}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleFlagReview(review._id)} disabled={review.isFlagged}>
                            <Flag className="h-4 w-4 mr-2 text-orange-500" />
                            Flag Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveReview(review._id)} className="text-red-600">
                            <X className="h-4 w-4 mr-2" />
                            Remove Review
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
