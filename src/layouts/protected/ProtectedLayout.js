import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../../zustand/useAuthStore';

export default function ProtectedLayout({ token }) {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore((state) => state);

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
