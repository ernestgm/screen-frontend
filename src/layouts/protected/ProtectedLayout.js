import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function ProtectedLayout({token}) {
    const navigate = useNavigate();
    useEffect(() => {
      if(!token) {
        navigate('/login', { replace: true });
      }
    }, [token]);

    
    return (
      <>
        <Outlet />
      </>
    );
}