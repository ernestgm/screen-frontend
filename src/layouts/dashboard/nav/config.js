// table
import * as React from "react";
import SvgColor from '../../../components/svg-color';
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

const icon = (name) => <Iconify icon={name}/>;

const navConfig = [
  {
    title: 'home',
    path: '/dashboard/app',
    icon: icon('ri:dashboard-2-line'),
    roles: ['admin']
  },
  {
    title: 'business',
    path: '/dashboard/business',
    icon: icon('ion:business-sharp'),
    roles: ['admin', 'owner', 'editor']
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('material-symbols:supervised-user-circle'),
    roles: ['admin']
  },
  {
    title: 'screens',
    path: '/dashboard/screens',
    icon: icon('mdi:monitor-dashboard'),
    roles: ['admin']
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  //   roles: ['admin']
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  //   roles: ['admin']
  // },
];

export default navConfig;
