import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import { authSlice } from './auth/authSlice';
import { departamentoSlice, cargoSlice, empleadoSlice, usuarioSlice, rolSlice , contratoSlice, horarioSlice, diasVacacionSlice, bonoAntiguedadSlice,  solicitudSlice} from './gestion';
import asistenciaReducer from './gestion/asistenciaSlice';


// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
   auth: authSlice.reducer,
   departamento: departamentoSlice.reducer,
   cargo: cargoSlice.reducer,
   empleado: empleadoSlice.reducer,
   usuario: usuarioSlice.reducer,
   roles: rolSlice.reducer,
   contrato: contratoSlice.reducer,
   horario: horarioSlice.reducer,
   diasVacacion: diasVacacionSlice.reducer,
   bonoAntiguedad: bonoAntiguedadSlice.reducer,
   solicitud: solicitudSlice.reducer, 
   asistencias: asistenciaReducer
});

export default reducer;
