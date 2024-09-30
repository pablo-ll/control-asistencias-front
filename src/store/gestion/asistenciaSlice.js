// asistenciaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions


// Update asistencias (save changes)


export const saveAsistencias = createAsyncThunk(
    'asistencias/saveAsistencias',
    async ({ asistencias, empleadoId }, { rejectWithValue }) => {
      try {
        const response = await controlAsistenciaApi.put(`/asistencias/save/${empleadoId}`, asistencias);
        
        if (!response.ok) {
          throw new Error('Error al guardar las asistencias');
        }
        
        return response.data; // Assuming response contains the updated asistencias
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error desconocido');
      }
    }
  );
// Asistencia slice
export const asistenciaSlice = createSlice({
    name: 'asistencias',
    initialState: {
      isLoading: false,
      asistencias: [],
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Save asistencias
        .addCase(saveAsistencias.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(saveAsistencias.fulfilled, (state, { payload }) => {
          state.isLoading = false;
          state.asistencias = Array.isArray(payload) ? payload : [];
          state.error = null;
        })
        .addCase(saveAsistencias.rejected, (state, { payload }) => {
          state.isLoading = false;
          state.error = payload;
        });
    },
  });
  
  export default asistenciaSlice.reducer;
  
