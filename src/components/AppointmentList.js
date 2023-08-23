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
import { Autocomplete, Box, Button, Divider, FormControl, IconButton, InputBase, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { Search as SearchIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { deleteAppointment, fetchAppointmentData, addAppointment, searchAppointmentsByStatus } from '../store/feature/AppointmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from './ConfirmationDialogs';
import Modal from '@mui/material/Modal';
import { useTranslation } from 'react-i18next';
import AppointmentForm from './AppointmentForm';


//statusa göre arama işlemi
//statusların renklendirilmesi
//add appointment kısmı



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
    statusAppo,
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
    const [selectedStatus, setSelectedStatus] = useState('');

    // const selectedStatus = useSelector((state) => state.appointments.selectedStatus);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };
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

    const handleSearch = () => {
        dispatch(fetchAppointmentData({ type: 'search', searchTerm }));
    };
    const handleSearchByStatus = async (status) => {
        // Seçilen status değerine göre arama yapmak için thunk'ı çağırın
        dispatch(searchAppointmentsByStatus(status));
    };

    // const handleCreatePatient = (Data) => {
    //     dispatch(addAppointment(patientData));
    //     setOpen(false);

    // };
    // const handleEditClick = (appointment) => {
    //     setEditedPatient(appointment);
    //     setOpen(true);
    // };


    const getStatusValueBasedOnLanguage = (statusAp) => {
        const statusConceptObject = statusAppo?.concept?.filter((element) => element.code === statusAp)[0] || undefined;
        return (
            statusConceptObject?.designation?.filter((element1) => element1.language === i18n.language)[0]?.value ||
            statusConceptObject?.display ||
            undefined
        );
    };




    return (
        <div>
            <div>
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <AppointmentForm

                            handleClose={handleClose}
                        />
                    </Box>
                </Modal>


            </div>

            <Paper sx={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
                <Typography
                    gutterBottom
                    variant='h5'
                    align='left'
                    component="div"
                    sx={{ padding: "20px" }}
                >
                    {t('patient.appointmentForm.title')}

                    <FormControl sx={{ marginLeft: '15px' }} variant="outlined" size='small' style={{ width: '20%' }}>
                        <InputLabel >{t('patient.appointmentForm.appoColumns.status')}</InputLabel>
                        <Select
                            value={selectedStatus}
                            onChange={(e, newValue) => {
                                setSelectedStatus(newValue.props.value);
                                handleSearchByStatus(newValue.props.value);
                            }}
                            label={t('patient.appointmentForm.appoColumns.status')}

                        >

                            {statusAppo?.concept?.map((option) => (
                                <MenuItem key={option.code} value={option.code}>
                                    {option?.designation?.filter((element) => element.language === i18n.language)[0]?.value ||
                                        option?.display ||
                                        ''}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                </Typography>

                <Divider />
                <Box height={10} />
                <Stack direction={"row"} spacing={2}>
                    <InputBase
                        style={{ color: 'black', marginLeft: '20px', borderInlineColor: '#B1AFAF' }}

                        placeholder={t('patient.list.columns.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton onClick={handleSearch} sx={{ color: 'black' }}>
                        <SearchIcon />
                    </IconButton>
                    <Typography variant='h6' component={'div'} sx={{ flexGrow: 1 }}></Typography>

                    <Button onClick={handleOpen} color='grey' variant="contained" endIcon={<AddCircle />}>{t('patient.appointmentForm.button.addAppointment')}</Button>
                </Stack>
                <Box height={10} />
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, maxWidth: '100px' }}
                                    >
                                        {t('patient.appointmentForm.appoColumns.' + column.id)}
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
                                            <TableCell>{appointment.end || '-'}</TableCell>
                                            <TableCell>{appointment.minutesDuration || '-'}</TableCell>
                                            <TableCell>  {`${appointment.participant?.[0]?.actor?.display} `}</TableCell>
                                            <TableCell>{`${appointment.participant?.[1]?.actor?.display} `}</TableCell>
                                            <TableCell>
                                                <Button size='small'  style={{borderRadius:'40px', backgroundColor:'#FFFFFFF'}} variant='outlined' >{getStatusValueBasedOnLanguage(appointment.status) || '-'}</Button>
                                            </TableCell>

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

        </div >
    );
}
export default AppointmentList;
