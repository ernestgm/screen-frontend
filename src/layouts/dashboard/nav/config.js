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
    title: 'slides',
    path: '/dashboard/slides',
    icon: icon('simple-icons:slides'),
    roles: ['admin', 'owner']
  },
  {
    title: 'Marquees',
    path: '/dashboard/marquees',
    icon: icon('material-symbols:rtt'),
    roles: ['admin', 'owner']
  },
  {
    title: 'QR Codes',
    path: '/dashboard/qr',
    icon: icon('material-symbols:qr-code-2'),
    roles: ['admin', 'owner']
  },
  {
    title: 'Devices',
    path: '/dashboard/devices',
    icon: icon('ic:outline-tv'),
    roles: ['admin', 'owner']
  },
];

export default navConfig;
