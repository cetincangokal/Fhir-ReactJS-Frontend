//table.js

import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Divider, IconButton, InputBase, Stack, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { Search as SearchIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { deleteAppointment, fetchAppointmentData, addAppointment } from '../store/feature/AppointmentSlice';
import { useDispatch } from 'react-redux';
import ConfirmationDialog from './ConfirmationDialogs';
import Modal from '@mui/material/Modal';
import Form from './Form';
import { useTranslation } from 'react-i18next';
import { Country, State } from 'country-state-city';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};




const AppointmentList = ({
    appointments,
    columns,
    page,
    appointmentsPage,
    status,
    totalAppointment,
    nextUrl,
    prevUrl,
    changePage,
    ChangeAppointment,
}) => {

    const dispatch = useDispatch();
    const [t, i18n] = useTranslation('global');
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        resetForm();
    };
    const [editedAppointment, setEditedAppointment] = useState(null);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingAppointmentId, setDeletingAppointmentId] = useState(null);


    const handleOpenDeleteConfirmation = (appointmentId) => {
        setDeleteConfirmationOpen(true);
        setDeletingAppointmentId(appointmentId);
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
        setDeletingAppointmentId(null);
    };

    const handleConfirmDelete = () => {
        if (deletingAppointmentId) {
            handleDeleteAppointment(deletingAppointmentId);
            handleCloseDeleteConfirmation();
        }
    };
    const handleDeleteAppointment = (appointmentId) => {
        dispatch(deleteAppointment(appointmentId));
    };



    // const handleCreatePatient = (Data) => {
    //     dispatch(addAppointment(patientData));
    //     setOpen(false);

    // };
    // const handleEditClick = (patient) => {
    //     setEditedPatient(patient);
    //     setOpen(true);
    // };
    const resetForm = async () => {
        setEditedAppointment(appointments);
    };





    return (
        <div>


            <Paper sx={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
                <Typography
                    gutterBottom
                    variant='h5'
                    component="div"
                    sx={{ padding: "20px" }}
                >
                    {t('patient.list.title')}
                </Typography>
                <Divider />

                <Box height={10} />
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {t('patient.list.columns.' + column.id)}
                                    </TableCell>
                                ))}
                                <TableCell align='left' style={{ minWidth: "100px" }}>

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {status === 'loading' && (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}

                        {status === 'failed' && (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        Error fetching data.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}

                        {status === 'succeeded' && (
                            <TableBody>
                                {appointments
                                    .slice(page * appointmentsPage, page * appointmentsPage + appointmentsPage)
                                    .map((appointment) => (
                                        <TableRow
                                            key={appointment.id}
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <TableCell>{appointment.id || '-'}</TableCell>
                                            <TableCell>{appointment.start || '-'}</TableCell>
                                            <TableCell>  {`${appointment.name?.[0]?.given?.[0] || ''} ${appointment.name?.[0]?.family || ''} ${appointment.name?.[0].text || ''
                                                    } `}</TableCell>
                                            <TableCell>{appointment.participant?.actor}</TableCell>
                                            <TableCell>{appointment.status}</TableCell>

                                            <TableCell align='left'>
                                                <Stack spacing={2} direction="row">

                                                    <IconButton
                                                        onClick={() => handleOpenDeleteConfirmation(appointment.id)}
                                                        sx={{ color: 'black', fontSize: '20px' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>

                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        )}

                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20]}
                    component="div"
                    count={totalAppointment}
                    rowsPerPage={appointmentsPage}
                    page={page}
                    onPageChange={changePage}
                    onRowsPerPageChange={ChangeAppointment}
                    nextIconButtonProps={{
                        disabled: !nextUrl,
                    }}
                    backIconButtonProps={{
                        disabled: !prevUrl,
                    }}
                />
                <ConfirmationDialog
                    open={deleteConfirmationOpen}
                    onClose={handleCloseDeleteConfirmation}
                    onConfirm={handleConfirmDelete}
                    title={t('patient.messages.deleteTitle')}
                    message={t('patient.messages.deleteMsg')}
                />
            </Paper>

        </div>
    );
}
export default AppointmentList;
