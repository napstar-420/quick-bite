import { Routes, Route, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PermissionBasedRoute from "./permission-based-route";
import ResourceBasedRoute from "./resource-based-route";
import ReviewsList from "../pages/ReviewsList";
import ReviewDetail from "../pages/ReviewDetail";
import EditReview from "../pages/EditReview";
import CreateReview from "../pages/CreateReview";

// Wrapper component for resource-based routes that need to fetch data first
const ReviewEditWrapper = () => {
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch(`/api/reviews/${reviewId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch review");
        }
        const data = await response.json();
        setReview(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Review not found</p>
      </div>
    );
  }

  // Once we have the review data, we can use ResourceBasedRoute
  return (
    <ResourceBasedRoute
      resource="review"
      action="update"
      resourceInstance={review}
      ownerField="userId"
    >
      <EditReview review={review} />
    </ResourceBasedRoute>
  );
};

const ReviewRoutes = () => {
  return (
    <Routes>
      {/* List all reviews - requires 'review' 'read' permission */}
      <Route
        path="/"
        element={
          <PermissionBasedRoute resource="review" action="read">
            <ReviewsList />
          </PermissionBasedRoute>
        }
      />

      {/* View a single review - requires 'review' 'read' permission */}
      <Route
        path="/:reviewId"
        element={
          <PermissionBasedRoute resource="review" action="read">
            <ReviewDetail />
          </PermissionBasedRoute>
        }
      />

      {/* Create a new review - requires 'review' 'create' permission */}
      <Route
        path="/create"
        element={
          <PermissionBasedRoute resource="review" action="create">
            <CreateReview />
          </PermissionBasedRoute>
        }
      />

      {/* Edit a review - requires ownership or admin permission */}
      <Route path="/edit/:reviewId" element={<ReviewEditWrapper />} />
    </Routes>
  );
};

export default ReviewRoutes;
