import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { FieldArray } from 'formik';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const VacationDetailsTable = ({ detalles, errors, touched, handleChange }) => {
  return (
    <FieldArray name="detalles">
      {({ push, remove }) => (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Inicio (&gt;)</TableCell>
                <TableCell>Fin (&lt;=)</TableCell>
                <TableCell>Días</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detalles.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      type="number"
                      name={`detalles[${index}].start`}
                      value={row.start}
                      onChange={handleChange}
                      error={touched?.[index]?.start && Boolean(errors?.[index]?.start)}
                      helperText={touched?.[index]?.start && errors?.[index]?.start}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name={`detalles[${index}].end`}
                      value={row.end}
                      onChange={handleChange}
                      error={touched?.[index]?.end && Boolean(errors?.[index]?.end)}
                      helperText={touched?.[index]?.end && errors?.[index]?.end}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name={`detalles[${index}].days`}
                      value={row.days}
                      onChange={handleChange}
                      error={touched?.[index]?.days && Boolean(errors?.[index]?.days)}
                      helperText={touched?.[index]?.days && errors?.[index]?.days}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => remove(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => push({ start: '', end: '', days: '' })}
                  >
                    Añadir Detalle
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </FieldArray>
  );
};

export default VacationDetailsTable;
