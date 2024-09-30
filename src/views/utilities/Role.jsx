import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { useRolStore } from 'hooks';


export const Role = () => {

  const navigate = useNavigate();
  const { 
    roles, 
    loadRoles,
    removeRol 
    
  } = useRolStore();

  useEffect(() => {
    loadRoles();
  }, []);


  const handleEdit = (role) => {
    navigate(`/role/edit/${role.id}`, { state: { role } });
  };

  const handleDelete = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleCreate = () => {
    navigate('/role/create');
  };

  return (
    <MainCard title="Gestión de Roles" >
    <Container>
      <Button variant="outlined" color="primary" onClick={handleCreate}>Create Role</Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>{role.nombre}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(role)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(role.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  </MainCard>
  );
};


