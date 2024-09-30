// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Gestion',
  type: 'group',
  children: [
    {
      id: 'util-departamentos',
      title: 'Departamentos',
      type: 'item',
      url: '/departamento',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'util-cargos',
      title: 'Cargos',
      type: 'item',
      url: '/cargo',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'util-empleados',
      title: 'Empleados',
      type: 'item',
      url: '/empleados',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'util-contratos',
      title: 'Contratos',
      type: 'item',
      url: '/contratos',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
    {
      id: 'util-asistencias',
      title: 'Asistencias',
      type: 'item',
      url: '/asistencias',
      icon: icons.IconShadow,
      breadcrumbs: false
    },
    {
      id: 'util-permisos',
      title: 'Vacaciones y Permisos',
      type: 'item',
      url: '/permiso',
      icon: icons.IconShadow,
      breadcrumbs: false
    }
  ]
};

export default utilities;
