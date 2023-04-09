import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../../zustand/useAuthStore';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";

export default function ProtectedLayout(props) {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore((state) => state);
  const {setApiToken} = useApiHandlerStore((state) => state)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    } else {
      setApiToken(currentUser)
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
