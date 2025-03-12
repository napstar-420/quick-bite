import axios from '../services/axios';
import { API_ROUTES } from './constants';

export function checkUserExists(email) {
  return axios.get(API_ROUTES.AUTH.CHECK_USER, { params: { email } });
}
