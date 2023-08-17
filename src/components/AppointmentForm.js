import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useDispatch } from 'react-redux';
import { createAppointment } from '../store/feature/PatientSlicer'; // Import edilen kısmı projenize uygun şekilde güncelleyin
import { useTranslation } from 'react-i18next';


const AppointmentForm = ({ onClose, patient }) => {
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [czNo, setCzNo] = useState('');
    const [selectedDate, setSelectedDate] = useState(null); // Eklenen satır
    const [t, i18n] = useTranslation('global');


    useEffect(() => {
        if (patient) {
            setGivenName(patient.name?.[0]?.given?.[0] || '');
            setFamilyName(patient.name?.[0]?.family || '');
            setCzNo(patient.identifier?.[0]?.value || '');
        }
    }, [patient]);

    const dispatch = useDispatch();

    const handleSave = async () => {
        const data = {
            givenName,
            familyName,
            czNo,
            startDateTime: selectedDate, // Eklendi
            endDateTime: selectedDate, // Eklendi
        };

        try {
            await dispatch(createAppointment(data)); // Randevu oluşturma thunk'ı çağrıldı
            onClose(data);
        } catch (error) {
            console.error('Error creating appointment:', error);
            // Hata durumunu ele almak için gerekli adımları burada yapabilirsiniz
        }
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant='h5' align='left'>
                    {t('patient.appointmentForm.title')}
                </Typography>
                <Box height={10} />
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            label={t('patient.list.columns.givenName')}
                            value={givenName}
                            size={'small'}

                            onChange={(e) => setGivenName(e.target.value)}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={4}>

                        <TextField
                            label={t('patient.list.columns.familyName')}
                            value={familyName}
                            size={'small'}

                            onChange={(e) => setFamilyName(e.target.value)}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={4}>

                        <TextField
                            label={t('patient.list.columns.identity')}
                            value={czNo}
                            size={'small'}
                            onChange={(e) => setCzNo(e.target.value)}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label={t('patient.appointmentForm.ApoDay')}
                                    slotProps={{ textField: { size: 'small' } }} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                                <TimePicker label={t('patient.appointmentForm.ApoTime')}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align='right' variant='h5'>
                            <Button onClick={handleSave} variant="contained" color="primary">
                            {t('patient.addModal.button.saveButton')}
                            </Button>
                            <Button style={{ marginLeft: 4 }} variant="contained" color="secondary">
                            {t('patient.addModal.button.cancel')}
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>


            </Box>
        </div>
    );
};

export default AppointmentForm;
