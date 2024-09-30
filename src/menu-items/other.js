// assets
import {  IconFileSettings, IconReportAnalytics } from '@tabler/icons-react';

// constant
const icons = { IconFileSettings, IconReportAnalytics };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'parametros',
      title: 'Configurar Parametros',
      type: 'item',
      url: '/parametros',
      icon: icons.IconFileSettings,
      breadcrumbs: false
    },
    {
      id: 'reportes',
      title: 'Reportes',
      type: 'item',
      url: '/reportes',
      icon: icons. IconReportAnalytics,
      breadcrumbs: false
    }
  ]
};

export default other;
