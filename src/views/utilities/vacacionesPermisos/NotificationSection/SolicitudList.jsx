import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

// project-import
import Chip from 'ui-component/extended/Chip';

import { formatDistanceToNow } from 'date-fns';
import esES from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhotoDown, IconCheck, IconX } from '@tabler/icons-react';

import { useEmpleadoStore } from 'hooks';
import { useSolicitudStore } from 'hooks/useSolicitudStore';
import { useEffect, useState } from 'react';
import RechazarForm from '../RechazarForm';


const ListItemWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'primary.light'
        }
      }}
    >
      {children}
    </Box>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const SolicitudList = ({ filter }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { empleados, loadEmpleados } = useEmpleadoStore();
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const {
    solicitudes,
    activeSolicitud,
    isLoading,
    error,
    loadSolicitudes,
    saveSolicitud,
    selectSolicitud,
    clearSelectedSolicitud,
    removeSolicitud
  } = useSolicitudStore();

  const handleOpen = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSolicitud(null);
  };

  const handleRechazar = async (comment) => {
 
    try {

      
      if (selectedSolicitud) {
        const solicitudRechazada = { ...selectedSolicitud, estado: 'RECHAZADA', comentario: comment };
        await saveSolicitud(solicitudRechazada); 
      }
     
       
  
      Swal.fire({
        icon: 'success',
        title: selectedSolicitud.tipo==='VACACION' ? 'Solicitud de vacacion rechazada' : 'Solicitud de baja medica rechazada',
        text: `Se notificara al empleado que solicitud fue rechazada`,
        timer: 2000,
        showConfirmButton: false,
      });
  
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un problema al procesar la solicitud. Inténtalo de nuevo.`,
      });
    }
    
  };
  useEffect(() => {
    loadSolicitudes(); // Cargar las solicitudes cuando se monte el componente
  }, []);

  const filteredSolicitudes = solicitudes.filter((solicitud) => solicitud.tipo === filter);
  // Ordenar solicitudes por fecha de creación, de la más reciente a la más antigua
  const sortedSolicitudes = filteredSolicitudes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleAprobar = async(solicitud) => {
   
   
    try {

      const solicitudAprobada = { ...solicitud, estado: 'APROBADA' };
      await saveSolicitud(solicitudAprobada);
  
      Swal.fire({
        icon: 'success',
        title: solicitudAprobada.tipo==='VACACION' ? 'Solicitud de vacacion aprobada' : 'Solicitud de baja medica aprobada',
        text: `Se notificara al empleado que solicitud fue aprobada`,
        timer: 3000,
        showConfirmButton: false,
      });
  
     
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un problema al procesar la solicitud. Inténtalo de nuevo.`,
      });
    }

  };


  const handleDownload = (solicitud) => {
    const fechaFormateada = solicitud.fechaInicio.split('-').reverse().join('-');
    const fileName = `${getEmpleadoName(solicitud.empleadoId)} - Baja medica ${fechaFormateada}`;
    saveAs(solicitud.comprobanteBajaMedica, fileName);
  };

  const renderEstadoSolicitud = ( solicitud) => {
    switch (solicitud.estado) {
      case 'PENDIENTE':
        return (
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={6}>
                <Chip label="Aprobar" sx={chipSuccessG} onClick={() => handleAprobar(solicitud)} />
              </Grid>
              <Grid item xs={6}>
                <Chip label="Rechazar" sx={chipErrorSX} onClick={() => handleOpen(solicitud)} />
              </Grid>
            </Grid>
          </Grid>
        );
      case 'APROBADA':
        return <Box sx={{...chipSuccessG,   display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'}}  >aprobada  <IconCheck/></Box>;
      case 'RECHAZADA':
        return <Box sx={{...chipErrorSX, display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'}} >rechazada  <IconX/></Box>;
      default:
        return <Box >Estado desconocido</Box>;
    }
  };

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };

  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28
  };

  const chipSuccessG = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    border: 'none',
    borderColor: theme.palette.success.main
  };

  const getEmpleadoName = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? `${empleado.nombre} ${empleado.apellidoPaterno}` : 'desconocido';
  };

  return (
    <>
      <List
        sx={{
          width: '100%',
          maxWidth: 330,
          py: 0,
          borderRadius: '10px',
          [theme.breakpoints.down('md')]: {
            maxWidth: 300
          },
          '& .MuiListItemSecondaryAction-root': {
            top: 22
          },
          '& .MuiDivider-root': {
            my: 0
          },
          '& .list-container': {
            pl: 2
          }
        }}
      >
        {sortedSolicitudes.length === 0 ? (
          <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
            No hay solicitudes {filter === 'VACACION' ? 'de vacaciones' : 'de baja médica'} pendientes.
          </Typography>
        ) : (
          sortedSolicitudes.map((solicitud) => (
            <Box key={solicitud.id}>
              <ListItemWrapper>
                <ListItem alignItems="center">
                  <ListItemText primary={<Typography variant="subtitle1">{getEmpleadoName(solicitud.empleadoId)}</Typography>} />
                  <ListItemSecondaryAction>
                    <Grid container justifyContent="flex-end">
                      <Grid item xs={12}>
                        <Typography variant="caption" display="block" gutterBottom>
                          {formatDistanceToNow(new Date(solicitud.createdAt), { addSuffix: true, locale: esES })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem alignItems="center">
                  <ListItemText primary={<Typography variant="h6">Fecha inicio: </Typography>} />
                  <ListItemSecondaryAction>
                    <Grid container justifyContent="flex-end">
                      <Grid item xs={12}>
                        <Typography variant="caption" display="block" gutterBottom>
                          {solicitud.fechaInicio}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem alignItems="center" sx={{ pb: 2, mt: -3 }}>
                  <ListItemText primary={<Typography variant="h6">Fecha final: </Typography>} />
                  <ListItemSecondaryAction>
                    <Grid container justifyContent="flex-end">
                      <Grid item xs={12}>
                        <Typography variant="caption" display="block" gutterBottom>
                          {solicitud.fechaFin}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItemSecondaryAction>
                </ListItem>

                {/* Renderizar contenido basado en el tipo de solicitud */}
                <Grid container direction="column" className="list-container">
                  <Grid item xs={12} sx={{ pb: 2 }}>
                    <Typography variant="subtitle2">{solicitud.descripcion}</Typography>
                  </Grid>
                  {filter === 'BAJA_MEDICA' && (
                 <Grid item xs={12} sx={{ pb: 2 }}>
                   <Grid container>
                     <Grid item xs={12}>
                      
                         <Card
                           onClick={() => handleDownload(solicitud)}
                            sx={{
                              backgroundColor: theme.palette.secondary.light,
                              cursor: 'pointer', // Indica que es clicable
                              transition: 'all 0.3s ease', // Suaviza la transición de los efectos
                              '&:hover': {
                                boxShadow: 6, // Añade sombra al pasar el ratón
                                transform: 'scale(1.02)' // Agranda ligeramente el componente
                              },
                              '&:active': {
                                boxShadow: 1, // Reduce la sombra al hacer clic
                                transform: 'scale(0.98)' // Reduce ligeramente el tamaño al hacer clic
                                
                              }
                            
                           }}
                         >
                           <CardContent>
                             <Grid container direction="column">
                               <Grid item xs={12}>
                                 <Stack direction="row" spacing={2}>
                                   <IconPhotoDown stroke={1.5} size="1.3rem" />
                                   <Typography variant="subtitle1">Baja Medica</Typography>
                                 </Stack>
                               </Grid>
                             </Grid>
                           </CardContent>
                         </Card>
                      
                     </Grid>
                   </Grid>
                
                    </Grid> 
                    
                   
                  )}

                 {renderEstadoSolicitud(solicitud)}

                  
                 
                </Grid>
              </ListItemWrapper>
              <Divider />
            </Box>
          ))
        )}
      </List>

      <RechazarForm
        open={open}
        handleClose={handleClose}
        solicitud={selectedSolicitud}
        handleReject={handleRechazar}
      />
    </>
  );
};

export default SolicitudList;
