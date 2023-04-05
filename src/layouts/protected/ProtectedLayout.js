import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function ProtectedLayout() {
    const navigate = useNavigate();
    const isAuthenticated = false;

    useEffect(() => {
      if(!isAuthenticated) {
        console.log("Protegida")
        navigate('/login', { replace: true });
      }
    }, []);

    

    
    return (
      <>
        Pagina Protegida
        <Outlet />
      </>
    );
}