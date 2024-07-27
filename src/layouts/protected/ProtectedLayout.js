import { useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { filter } from 'lodash';
import useAuthStore from '../../zustand/useAuthStore';
import useApiHandlerStore from '../../zustand/useApiHandlerStore';
import useAccontHandlerStore from '../../zustand/useAccontHandlerStore';
import navConfig from '../dashboard/nav/config';
import useNavigateTo from '../../hooks/navigateTo';

export default function ProtectedLayout(props) {
  const { navigateTo } = useNavigateTo();
  const { pathname } = useLocation();
  const { currentUser, resetCurrentUser } = useAuthStore((state) => state);
  const { setApiToken } = useApiHandlerStore((state) => state);
  const { setAccountData } = useAccontHandlerStore((state) => state);

  const redirectUser = useCallback(() => {
    const pathWithAccess = filter(navConfig, (item) => item.roles.find((tag) => tag === currentUser?.user?.role?.tag));

    if (!pathWithAccess.some((item) => pathname.includes(item.path))) {
      navigateTo('/401');
    }
  }, [pathname, currentUser.user.role.tag, navigateTo]);

  useEffect(() => {
    if (!currentUser) {
      navigateTo('/login');
    } else {
      setApiToken(currentUser.token);
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
