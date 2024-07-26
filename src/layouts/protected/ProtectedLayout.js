import { useEffect } from 'react';
import {Outlet} from 'react-router-dom';
import {filter} from "lodash";
import useAuthStore from '../../zustand/useAuthStore';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useAccontHandlerStore from "../../zustand/useAccontHandlerStore";
import navConfig from "../dashboard/nav/config";
import useNavigateTo from "../../hooks/navigateTo";

export default function ProtectedLayout(props) {
  const { navigateTo } = useNavigateTo();
  const { currentUser, resetCurrentUser } = useAuthStore((state) => state);
  const {setApiToken} = useApiHandlerStore((state) => state)
  const {setAccountData} = useAccontHandlerStore((state) => state)

  useEffect(() => {
    if (!currentUser) {
      navigateTo('/login');
    } else {
      setApiToken(currentUser.token);
      setAccountData(currentUser.user);
      const pathWithAccess = filter(navConfig, (item) => item.roles.find(tag => tag === currentUser.user.role.tag));
      if (!pathWithAccess.some(item => item.path === window.location.pathname)) {
        navigateTo('/401');
      }
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
