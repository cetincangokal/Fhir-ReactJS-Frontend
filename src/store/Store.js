import { configureStore } from '@reduxjs/toolkit';
import appReducer from './feature/AppSlice';
import patientReducer from './feature/PatientSlicer';

const store = configureStore({
  reducer: {
    app: appReducer,
    patients: patientReducer,
  },
});

export default store;
