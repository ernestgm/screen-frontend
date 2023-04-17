// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'bussiness',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    roles: ['admin', 'owner', 'editor']
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
    roles: ['admin']
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
    roles: ['admin']
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
    roles: ['admin']
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
    roles: ['admin']
  },
];

export default navConfig;
