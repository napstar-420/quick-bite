import { useSelector } from "react-redux";
import {
  selectRestaurant,
  selectBranches
} from "../features/partner/partnerSlice";

export const usePartner = () => {
  const restaurant = useSelector(selectRestaurant);
  const branches = useSelector(selectBranches);

  return {
    restaurant,
    branches
  }
}