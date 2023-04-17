import {useEffect} from "react";
import {Navigate, useNavigate, useRoutes} from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/user/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ProtectedLayout from './layouts/protected/ProtectedLayout';
import CreateUserPage from "./pages/user/CreateUserPage";
import BusinessPage from "./pages/business/BusinessPage";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <ProtectedLayout />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { element: <Navigate to="/dashboard/app" />, index: true },
            { path: 'app', element: <DashboardAppPage /> },
              // Business
            { path: 'business', element: <BusinessPage /> },
              // Users
            { path: 'user', element: <UserPage /> },
            { path: 'user/create', element: <CreateUserPage /> },
            { path: 'user/edit/:id', element: <CreateUserPage /> },
            // Others
            { path: 'products', element: <ProductsPage /> },
            { path: 'blog', element: <BlogPage /> },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
    path: '/404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
  ]);

  return routes;
}
