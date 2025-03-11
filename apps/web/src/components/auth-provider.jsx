import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRefreshMutation } from '../features/auth/authApiSlice';
import { setCredentials, logout } from '../features/auth/authSlice';
import { Outlet } from 'react-router-dom';

const AuthProvider = () => {
  const dispatch = useDispatch();
  const [refresh, { isLoading }] = useRefreshMutation();

  useEffect(() => {
    // Try to refresh token on app load
    const verifyRefreshToken = async () => {
      try {
        const { data } = await refresh().unwrap();
        dispatch(setCredentials({ token: data.token, user: data.user }));
      } catch (error) {
        console.error('Token refresh failed:', error);
        dispatch(logout());
      }
    };

    verifyRefreshToken();
  }, [dispatch, refresh]);

  return isLoading ? <div className='text-6xl'>Loading...</div> : <Outlet />;
};

export default AuthProvider;
