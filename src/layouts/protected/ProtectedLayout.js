import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApiHandlerStore2 } from '../../zustand/useApiHandlerStore';
import ApiHanler from '../../utils/handlers/ApiHandler';
import useAuthStore from '../../zustand/useAuthStore';

export default function ProtectedLayout(props) {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore((state) => state);
  useApiHandlerStore2(new ApiHanler(currentUser));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
