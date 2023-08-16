import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


const AppointmentForm = ({ onClose, patient }) => {
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [czNo, setCzNo] = useState('');

    useEffect(() => {
        if (patient) {
            setGivenName(patient.name?.[0]?.given?.[0] || '');
            setFamilyName(patient.name?.[0]?.family || '');
            setCzNo(patient.identifier?.[0]?.value || '');
        }
    }, [patient]);

    const handleSave = () => {
        const data = {
            givenName,
            familyName,
            czNo,
        };

        onClose(data);
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant='h5' align='left'>
                    Appointment Form
                </Typography>
                <Box height={10} />
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            label="Name"
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
                            label="Surname"
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
                            label="Identity"
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
                            <DemoContainer  components={['DatePicker']}>
                                <DatePicker label="Appointment Day"
                                    slotProps={{ textField: { size: 'small' } }} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer  components={['TimePicker']}>
                                <TimePicker label="Appointment Time"
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align='right' variant='h5'>
                            <Button onClick={handleSave} variant="contained" color="primary">
                                Save
                            </Button>
                            <Button style={{ marginLeft: 4 }} variant="contained" color="secondary">
                                Cancel
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>


            </Box>
        </div>
    );
};

export default AppointmentForm;
