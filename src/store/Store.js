import { configureStore } from '@reduxjs/toolkit';
import appReducer from './feature/AppSlice';
import patientReducer from './feature/PatientSlicer';
import appointmentReducer from './feature/AppointmentSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    patients: patientReducer,
    appointments: appointmentReducer
  },
});

export default store;