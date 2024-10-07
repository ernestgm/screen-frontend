import { useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { filter } from 'lodash';
import useAuthStore from '../../zustand/useAuthStore';
import useApiHandlerStore from '../../zustand/useApiHandlerStore';
import useAccontHandlerStore from '../../zustand/useAccontHandlerStore';
import navConfig from '../dashboard/nav/config';
import useNavigateTo from '../../hooks/navigateTo';
import useLocationStore from "../../zustand/useLocationStore";

export default function ProtectedLayout(props) {
  const { navigateTo } = useNavigateTo();
  const { pathname } = useLocation();
  const { currentUser } = useAuthStore((state) => state);
  const { setApiToken } = useApiHandlerStore((state) => state);
  const { setAccountData } = useAccontHandlerStore((state) => state);
  const { setCurrentLocation } = useLocationStore((state) => state)

  const redirectUser = useCallback(() => {
    const pathWithAccess = filter(navConfig, (item) => item.roles.find((tag) => tag === currentUser?.user?.role?.tag));
    pathWithAccess.push({path: '/dashboard'})
    if (!pathWithAccess.some((item) => pathname.includes(item.path))) {
      navigateTo('/401');
    }
  }, [pathname, currentUser && currentUser.user.role.tag, navigateTo]);

  useEffect(() => {
    if (!currentUser) {
      setCurrentLocation(pathname)
      navigateTo('/login');
    } else {
      setApiToken(currentUser.token, currentUser.refresh_token);
      setAccountData(currentUser.user);

      redirectUser();
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
