import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ContratoCard = ({ contrato, handleEdit, handleDelete, getEmpleadoName, handleOpenDetails }) => {
  return (
    <Card>
      <CardContent onClick={() => handleOpenDetails(contrato)}>
        <Typography variant="h5" component="div">
      
          {getEmpleadoName(contrato.empleadoId)}
        </Typography>
        <Typography color="textSecondary">
          Tipo de Contrato: {contrato.tipoEmpleado}
        </Typography>
        <Typography color="textSecondary">
          Fecha de Inicio: {contrato.fechaInicio}
        </Typography>
        <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(contrato); }}>
          <Edit />
        </IconButton>
        <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(contrato.id); }}>
          <Delete />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ContratoCard;
