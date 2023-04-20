import { useEffect } from 'react';
import {Outlet, Router, useNavigate} from 'react-router-dom';
import {filter} from "lodash";
import useAuthStore from '../../zustand/useAuthStore';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useAccontHandlerStore from "../../zustand/useAccontHandlerStore";
import navConfig from "../dashboard/nav/config";

export default function ProtectedLayout(props) {
  const navigate = useNavigate();
  const { currentUser, resetCurrentUser } = useAuthStore((state) => state);
  const {setApiToken} = useApiHandlerStore((state) => state)
  const {setAccountData} = useAccontHandlerStore((state) => state)

  useEffect(() => {
    if (!currentUser) {

      navigate('/login', { replace: true });

    } else {
      setApiToken(currentUser.token);
      setAccountData(currentUser.user);
      const pathWithAccess = filter(navConfig, (item) => item.roles.find(tag => tag === currentUser.user.role.tag));
      if (!pathWithAccess.some(item => item.path === window.location.pathname)) {
        navigate('/401', { replace: true });
      }
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
