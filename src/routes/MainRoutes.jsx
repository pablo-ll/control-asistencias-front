import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Departamento } from 'views/utilities/Departamento';
import { Cargo } from 'views/utilities/Cargo';
import { Usuario } from 'views/utilities/Usuario';
import { Role } from 'views/utilities/Role';
import { Navigate } from 'react-router-dom';
import { RoleForm } from 'views/utilities/RoleForm';
import { Empleados } from 'views/utilities/Empleados';
import { Contratos } from 'views/utilities/Contratos';
import { Asistencias } from 'views/utilities/Asistencias';
import { EmpleadoForm } from 'views/utilities/EmpleadoForm';
import { ListarContratos } from 'views/utilities/ListarContratos';
import { CorrecionAsistencia } from 'views/utilities/CorrecionAsistencia';
import { Parametros } from 'views/utilities/parametros/Parametros';
import { Vacaciones } from 'views/utilities/vacacionesPermisos/Vacaciones';



// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));


const VacacionPermiso = Loadable(lazy(() => import('views/utilities/VacacionPermiso')));

// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [ 
  {
  path: '/',
  element:  <MainLayout />
  ,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: 'sample-page',
      element: <VacacionPermiso />
    },
    {
      path: 'permiso',
      element: <Vacaciones />
    },
    {
      path: 'departamento',
      element: <Departamento />
    },
    {
      path: 'role',
      element: <Role />
    },
    {
      path: 'usuario',
      element: <Usuario/>
    },
    {
      path: 'cargo',
      element: <Cargo />
    },
    {
      path: 'empleados',
      element: <Empleados />
    },
    {
      path: 'empleados/crear',
      element: <EmpleadoForm />
    },
    {
      path: 'empleados/modificar/:id',
      element: <EmpleadoForm />
    },
    {
      path: 'contratos',
      element: <Contratos />
    },
    {
      path: 'contratos/listar',
      element: <ListarContratos />
    },
    {
      path: 'asistencias',
      element: <Asistencias />
    },
    {
      path: 'asistencias/correccion/:id',
      element: <CorrecionAsistencia />
    },
    {
      path: 'role/edit/:id',
      element: <RoleForm />
    },
    {
      path: 'role/create',
      element: <RoleForm />
    },
    {
      path: 'parametros',
      element: <Parametros/>
    },
   
  ]
},
{
  path: '*',
  element: <Navigate to="/" />
}];

export default MainRoutes;