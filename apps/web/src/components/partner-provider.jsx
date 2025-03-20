import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useGetRestaurantQuery,
  useGetBranchesQuery,
} from "../features/partner/partnerApiSlice";
import { reset } from "../features/partner/partnerSlice";
import { Outlet } from "react-router-dom";
import config from "../config";
import PendingApproval from "../pages/partner/pending-approval";

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
    return <div>Sorry no restaurant could be found</div>;
  }

  if (restaurant.status === config.RESTAURANT_STATUS.UNDER_REVIEW) {
    return <PendingApproval />;
  }

  return <Outlet />;
}
