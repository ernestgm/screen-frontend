import {Navigate, useNavigate, useRoutes} from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
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
import CreateBusinessPage from "./pages/business/CreateBusinessPage";
import Page401 from "./pages/Page401";
import DetailsBusinessPage from "./pages/business/DetailsBusinessPage";
import DetailsAreasPage from "./pages/areas/DetailsAreasPage";
import DetailsScreenPage from "./pages/screen/DetailsScreenPage";
import CreateImagePage from "./pages/images/CreateImagePage";
import Dashboard from "./pages/main/Dashboard";

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
            { path: 'app', element: <Dashboard /> },
              // Business
            { path: 'business', element: <BusinessPage /> },
            { path: 'business/create', element: <CreateBusinessPage /> },
            { path: 'business/edit/:id', element: <CreateBusinessPage /> },
            { path: 'business/details/:id', element: <DetailsBusinessPage /> },
              // Areas
            { path: 'area/details/:id', element: <DetailsAreasPage /> },
              // Screen
            { path: 'screen/details/:id', element: <DetailsScreenPage /> },
              // Images
            { path: 'image/edit/:pscreen/:pimage', element: <CreateImagePage /> },
            { path: 'image/create/:pscreen', element: <CreateImagePage /> },

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
      path: '/401',
      element: <Page401 />,
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
