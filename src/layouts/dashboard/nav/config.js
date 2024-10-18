// table
import * as React from "react";
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

const icon = (name) => <Iconify icon={name}/>;

const navConfig = [
  {
    title: 'home',
    path: '/dashboard/app',
    icon: icon('ri:dashboard-2-line'),
    roles: ['admin', 'owner', 'editor']
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('material-symbols:supervised-user-circle'),
    roles: ['admin']
  },
  {
    title: 'business',
    path: '/dashboard/business',
    icon: icon('ion:business-sharp'),
    roles: ['admin', 'owner', 'editor']
  },
  {
    title: 'screens',
    path: '/dashboard/screens',
    icon: icon('mdi:monitor-dashboard'),
    roles: ['admin', 'owner']
  },
  {
    title: 'Devices',
    path: '/dashboard/devices',
    icon: icon('mdi:cast-variant'),
    roles: ['admin', 'owner']
  },
  {
    title: 'Marquees',
    path: '/dashboard/marquees',
    icon: icon('material-symbols:rtt'),
    roles: ['admin', 'owner']
  },
  // {
  //   title: 'logs',
  //   path: '/dashboard/logs',
  //   icon: icon('material-symbols:list-alt'),
  //   roles: ['admin']
  // },
];

export default navConfig;
