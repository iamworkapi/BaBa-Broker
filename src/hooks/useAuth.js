import { useAppDispatch, useAppSelector } from '../store';
import { selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../store/authSlice.js';
import { login, logout as logoutAction } from '../store/authSlice.js';

export { selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError };

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const doLogin = (credentials) => dispatch(login(credentials));
  const doLogout = () => dispatch(logoutAction());

  return { user, isLoggedIn, isLoading, error, login: doLogin, logout: doLogout };
}
