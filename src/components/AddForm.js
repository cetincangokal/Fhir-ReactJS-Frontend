import { Grid, IconButton, Typography, Box, TextField, Button, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPatient, updatePatient } from '../store/feature/PatientSlicer';

export default function AddForm({ id, editedPatient }) {
    const dispatch = useDispatch();
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [useType, setUseType] = useState('official');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [telecoms, setTelecoms] = useState([
        { system: 'phone', value: '', use: 'work', rank: 1 },
    ]);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (editedPatient) {
            setGivenName(editedPatient.name?.[0]?.given?.[0] || '');
            setFamilyName(editedPatient.name?.[0]?.family || '');
            setUseType(editedPatient.name?.[0]?.use || 'official');
            setGender(editedPatient.gender || '');
            setBirthDate(editedPatient.birthDate || '');
            setTelecoms(editedPatient.telecom || [
                { system: 'phone', value: '', use: 'work', rank: 1 },
            ]);
            setAddress(editedPatient.address?.[0]?.line?.[0] || '');
        }
    }, [editedPatient]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTelecoms = telecoms.map((telecom) => ({
            system: 'phone',
            value: telecom.value,
            use: telecom.use,
        }));
    
        const newPatient = {
            resourceType: 'Patient',
            name: [
                {
                    useType,
                    family: familyName,
                    given: [givenName],
                },
            ],
            gender,
            birthDate,
            telecom: newTelecoms, // Burada güncellenen telecoms dizisini kullanın
            address: [{ line: [address] }],
        };

        try {
            setGivenName('');
            setFamilyName('');
            setUseType('official');
            setGender('');
            setBirthDate('');
            setTelecoms([{ system: 'phone', value: '', use: 'work', rank: 1 }]);
            setAddress('');
            if (!id) {
                dispatch(addPatient(newPatient));


            }else{
                dispatch(updatePatient(id, newPatient));
            }


        } catch (error) {
            console.error('Error creating patient:', error);
        }
    };

    const handleAddTelecom = () => {
        setTelecoms((prevTelecoms) => [
            ...prevTelecoms,
            { system: 'phone', value: '', use: 'work', rank: prevTelecoms.length + 1 },
        ]);
    };

    const handleRemoveTelecom = (index) => {
        setTelecoms((prevTelecoms) =>
            prevTelecoms.filter((telecom, i) => i !== index)
        );
    };

    const handleTelecomChange = (index, field, value) => {
        setTelecoms((prevTelecoms) =>
            prevTelecoms.map((telecom, i) =>
                i === index ? { ...telecom, [field]: value } : telecom
            )
        );
    };


    return (
        <>
            <Box sx={{ m: 2 }} />
            <Typography variant='h5' align='center'>
                Add Patient
            </Typography>

            <Box height={20} />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            id='outlined-basic'
                            label="Given Name"
                            variant='outlined'
                            size='small'
                            type="text"
                            value={givenName}
                            onChange={(e) => setGivenName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id='outlined-basic'
                            label="Family Name"
                            variant='outlined'
                            size='small'
                            type="text"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Select value={useType} onChange={(e) => setUseType(e.target.value)} size="small">
                            <MenuItem value="official">Official</MenuItem>
                            <MenuItem value="usual">Usual</MenuItem>
                            <MenuItem value="nickname">Nickname</MenuItem>
                            <MenuItem value="anonymous">Anonymous</MenuItem>
                            <MenuItem value="old">Old</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <Select name='Gender' size='small' value={gender || 'unknown'} onChange={(e) => setGender(e.target.value)} required>
                            <MenuItem value="unknown">Unknown</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id='outlined-basic'
                            variant='outlined'
                            size='small'
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id='outlined-basic'
                            label="Adress"
                            variant='outlined'
                            size='small'
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel style={{ color: '#FFFFFF' }}>Phone Numbers:</InputLabel>
                        {telecoms.map((telecom, index) => (
                            <div key={index}>
                                <TextField
                                    type="text"
                                    size='small'
                                    value={telecom.value}
                                    onChange={(e) =>
                                        handleTelecomChange(index, 'value', e.target.value)
                                    }
                                    required
                                />
                                <Select
                                    value={telecom.use}
                                    size='small'
                                    onChange={(e) =>
                                        handleTelecomChange(index, 'use', e.target.value)
                                    }
                                >
                                    <MenuItem value="home">Home</MenuItem>
                                    <MenuItem value="work">Work</MenuItem>
                                    <MenuItem value="mobile">Mobile</MenuItem>
                                    <MenuItem value="old">Old</MenuItem>
                                </Select>
                                {index > 0 && (
                                    <Button color='grey' variant="contained"
                                        type="button"
                                        size='small'
                                        onClick={() => handleRemoveTelecom(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button type="button" onClick={handleAddTelecom} size='small' color='grey' variant="contained" sx={{margin:'5px'}}>
                            Add Phone Number
                        </Button>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant='h5' align='center'>
                            <Button type='submit' variant="contained">
                                Submit
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
                </form>

                <Box sx={{ m: 4 }} />
            </>
            )
}
