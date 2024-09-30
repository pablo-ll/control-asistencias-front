// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Control de Asistencia',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'administracion',
      title: 'Administracion',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        
         {
          id: 'roles',
          title: 'Roles',
          type: 'item',
          url: '/role',
          target: false
        },
        {
          id: 'usuarios',
          title: 'Usuarios',
          type: 'item',
          url: '/usuario',
          target: false
        } 
      ]
    }
  ]
};

export default pages;
