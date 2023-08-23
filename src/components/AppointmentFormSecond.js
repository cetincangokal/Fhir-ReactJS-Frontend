import { useState } from 'react';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Checkbox, FormControl, Grid, IconButton, InputBase, InputLabel, MenuItem, Select, Stack, TableSortLabel, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTranslation } from 'react-i18next';

import { useDispatch } from 'react-redux';


const AppointmentFormSecond = ({}) => {


    const dispatch = useDispatch();
    const [t, i18n] = useTranslation('global');


    return (
        <div>

            <Box sx={{ flexGrow: 1 }} />
            <Typography variant='h5' align='left'>
                {t('patient.appointmentForm.createTitle')}
            </Typography>
            {/* departman
                uzman 
                tarih
                hastabilgisi (id,isim,cinsiyet)
            */}

            <Box height={10} />
            <form >
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.appointmentForm.appoColumns.department')}</InputLabel>
                            <Select
                                label={t('patient.appointmentForm.appoColumns.department')}

                            >
                                <MenuItem>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.appointmentForm.appoColumns.expert')}</InputLabel>
                            <Select
                                label={t('patient.appointmentForm.appoColumns.expert')}

                            >
                                <MenuItem>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>

                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.appointmentForm.appoColumns.date')}</InputLabel>
                            <Select
                                label={t('patient.appointmentForm.appoColumns.date')}

                            >
                                <MenuItem>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.appointmentForm.appoColumns.patientData')}</InputLabel>
                            <Select
                                label={t('patient.appointmentForm.appoColumns.patientData')}

                            >
                                <MenuItem>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='h5' align='right'>
                            <Button  style={{ backgroundColor: "#F7FAF7", color: 'grey' }} variant="contained">
                                {t('patient.addModal.button.cancel')}
                            </Button>
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant='h5' align='right'>
                            <Button
                                type='submit' variant="contained">
                                {t('patient.appointmentForm.button.createAppo')}

                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
            </form>

            <Box sx={{ m: 4 }} />
        </div>
    );
};

export default AppointmentFormSecond;
