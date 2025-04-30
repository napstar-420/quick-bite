import axios from "../services/axios";
import { API_ROUTES } from "./constants";

export function checkUserExists(email) {
  return axios.get(API_ROUTES.AUTH.CHECK_USER, { params: { email } });
}

export function getUser(id, signal = null) {
  return axios.get(API_ROUTES.GET_USER(id), {
    signal: signal,
  });
}
