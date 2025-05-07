import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useGetRestaurantQuery,
  useGetBranchesQuery,
} from "../features/partner/partnerApiSlice";
import { reset } from "../features/partner/partnerSlice";
import { Link, Outlet } from "react-router-dom";
import config from "../config";
import PendingApproval from "../pages/partner/pending-approval";
import { Button } from "./ui/button";

export default function PartnerProvider() {
  const dispatch = useDispatch();
  const { data: restaurant = null, isLoading: isLoadingRestaurant } =
    useGetRestaurantQuery();
  const { data: branches = [], isLoading: isLoadingBranches } =
    useGetBranchesQuery();

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoadingRestaurant || isLoadingBranches) {
    return <div className="text-6xl">Loading...</div>;
  }

  if (!restaurant || !branches.length) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">No Restaurant Found</h1>
      <p className="mb-4">
        You need to create a restaurant first before managing menus.
      </p>
      <Button asChild>
        <Link to={config.ROUTES.PARTNER_NEW}>Create Restaurant</Link>
      </Button>
    </div>;
  }

  if (restaurant.status === config.RESTAURANT_STATUS.UNDER_REVIEW) {
    return <PendingApproval />;
  }

  return <Outlet />;
}
