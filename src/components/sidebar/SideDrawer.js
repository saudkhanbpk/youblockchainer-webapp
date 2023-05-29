import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { AppBar, Button, CardMedia, Grid, Toolbar } from '@mui/material';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { btn, df_jfe_ac } from '../../theme/CssMy'
import { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import LoginModal from '../modal/LoginModal';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(8)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        boxShadow: '0px 1px 26px rgba(94, 99, 116, 0.05)',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const imgStyle = {
    borderRadius: '50px'
}

const listItemBtn = {
    justifyContent: 'initial',
    px: 2.5,
}

const listItemIco = {
    minWidth: 0,
    justifyContent: 'center',
}

const gridItem = {
    padding: '8px',
    minHeight: '20px',
}

const gridcon = {
    display: 'flex',
    alignItems: 'space-between',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'space-between'
}

export default function SideDrawer(props) {
    const { children } = props
    const url = window.location.href.split('/')[3]
    const { user } = useContext(ybcontext)
    const navigate = useNavigate()
    console.log(url)
    const { open, setOpen } = useContext(ybcontext)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    console.log(open)

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar sx={{ marginLeft: '50px', backgroundColor: 'white', color: '#3770FF', boxShadow: '0px 1px 26px rgba(94, 99, 116, 0.05)' }}>
                <Toolbar sx={df_jfe_ac}>
                    <Button onClick={() => setOpen(true)} sx={btn}>Connect account</Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" >
                <Box sx={gridcon}>
                    <Box sx={gridItem}>
                        <CardMedia sx={imgStyle} component='img' image='https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg' />
                    </Box>
                    <Box>
                        <List>
                            <ListItem disablePadding onClick={() => navigate('/')} sx={{ display: 'block', marginTop: '20%' }}>
                                <ListItemButton sx={listItemBtn}>
                                    <ListItemIcon sx={listItemIco}>
                                        <Icon icon="material-symbols:home-rounded" color={url === '' ? '#3770FF' : '#6A707F'} width='26' height='26' />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding onClick={() => navigate('/chat')} sx={{ display: 'block', marginTop: '20%' }}>
                                <ListItemButton sx={listItemBtn}>
                                    <ListItemIcon sx={{ ...listItemIco, marginLeft: '2px' }}>
                                        <Icon color={url === 'chat' ? '#3770FF' : '#6A707F'} icon="mdi:message" width='20' height='20' />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding onClick={() => navigate('/experts')} sx={{ display: 'block', marginTop: '20%' }}>
                                <ListItemButton sx={listItemBtn}>
                                    <ListItemIcon sx={listItemIco}>
                                        <Icon color={url === 'experts' ? '#3770FF' : '#6A707F'} icon="mdi:user-search" width='24' height='24' />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding onClick={() => navigate('/myorganization')} sx={{ display: 'block', marginTop: '20%' }}>
                                <ListItemButton sx={listItemBtn}>
                                    <ListItemIcon sx={listItemIco}>
                                        <Icon color={url === 'myorganization' ? '#3770FF' : '#6A707F'} icon="mingcute:building-2-fill" width='24' height='24' />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding onClick={() => navigate('/organizations')} sx={{ display: 'block', marginTop: '20%' }}>
                                <ListItemButton sx={listItemBtn}>
                                    <ListItemIcon sx={listItemIco}>
                                        <Icon color={url === 'organizations' ? '#3770FF' : '#6A707F'} icon="mdi:briefcase-search" width='24' height='24' />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                    <Box>
                        <List>
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton sx={listItemBtn}>
                                    <ListItemIcon sx={listItemIco}>
                                        <InboxIcon />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
            <LoginModal open={open} handleOpen={handleOpen} handleClose={handleClose} setOpen={setOpen} user={user} />

        </Box>
    );
}