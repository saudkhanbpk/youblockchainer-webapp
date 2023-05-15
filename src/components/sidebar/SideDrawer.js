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
import { CardMedia, Grid } from '@mui/material';

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
    px: 2.7,
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
    const [open, setOpen] = React.useState(false);
    const { children } = props

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent" >
                <Box sx={gridcon}>
                    <Box sx={gridItem}>
                        <CardMedia sx={imgStyle} component='img' image='https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg' />
                    </Box>
                    <Box>
                        <List>
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton sx={listItemBtn}>
                                    <ListItemIcon sx={listItemIco}>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Hello'} sx={{ opacity: open ? 1 : 0 }} />
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
                                    <ListItemText primary={'Hello'} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
}