import React from 'react'
import SideNavBar from '../components/SideNavbar'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';


export default function Settings() {
    return (
        <>
            <Navbar />
            <Box height={30} />
            <Box sx={{ display: 'flex' }}>
                <SideNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <h1>Settings</h1>

                </Box>
            </Box>


        </>
    )
}
