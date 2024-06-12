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
import {
  AppBar,
  Avatar,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { btn, circularImage, df_jc_ac, df_jfe_ac } from '../../theme/CssMy';
import { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import LoginModal from '../modal/LoginModal';
import logo from '../../images/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import { isMobile } from 'react-device-detect';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BuyScriptModal from '../chatt/BuyScriptModal';
import { useEffect } from 'react';
import BuyModal from '../chatt/BuyModal';
import { BubbleChartRounded } from '@mui/icons-material';
import BuyCreditCardModal from '../chatt/BuyCreditCardModal';

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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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
}));

const imgStyle = {
  borderRadius: '50px',
};

const listItemBtn = {
  justifyContent: 'initial',
  px: 2.5,
};

const listItemIco = {
  minWidth: 0,
  justifyContent: 'center',
};

const gridItem = {
  padding: '8px',
  minHeight: '20px',
};

const gridcon = {
  display: 'flex',
  alignItems: 'space-between',
  flexDirection: 'column',
  height: '100vh',
  justifyContent: 'space-between',
};

export default function SideDrawer(props) {

  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null)
  const { children } = props;
  const url = window.location.href.split('/')[3];
  const { user, setUser, setToken, open, setOpen, open2, setOpen2, auth, pendingScripts } =
    useContext(ybcontext);
  const navigate = useNavigate();
  console.log(url);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const [mobileOpen, setMobileOpen] = React.useState(false);
 
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

const handleSelectedPayment =(paymentMethod)=>{
  setSelectedPaymentMethod(paymentMethod)
  handleClose2()
}

  const drawer = (
    <Box sx={gridcon}>
      <Box sx={{ ...df_jc_ac, marginTop: '5%' }}>
        <CardMedia
          component='img'
          image={logo}
          sx={{ borderRadius: '50px', width: '75%' }}
        />
      </Box>
      <Box>
        <List>
          <Tooltip title='Dashboard'>
            <ListItem
              disablePadding
              onClick={() => navigate('/')}
              sx={{ display: 'block', marginTop: '20%' }}
            >
              <ListItemButton sx={listItemBtn}>
                <ListItemIcon sx={listItemIco}>
                  <Icon
                    icon='material-symbols:home-rounded'
                    color={url === '' ? '#3770FF' : '#6A707F'}
                    width='26'
                    height='26'
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
          <Tooltip title='Chat'>
            <ListItem
              disablePadding
              onClick={() => navigate('/chat')}
              sx={{ display: 'block', marginTop: '20%' }}
            >
              <ListItemButton sx={listItemBtn}>
                <ListItemIcon sx={{ ...listItemIco, marginLeft: '2px' }}>
                  <Icon
                    color={url.includes('chat') ? '#3770FF' : '#6A707F'}
                    icon='mdi:message'
                    width='20'
                    height='20'
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
          <Tooltip title='Find experts'>
            <ListItem
              disablePadding
              onClick={() => navigate('/experts')}
              sx={{ display: 'block', marginTop: '20%' }}
            >
              <ListItemButton sx={listItemBtn}>
                <ListItemIcon sx={listItemIco}>
                  <Icon
                    color={url.includes('expert') ? '#3770FF' : '#6A707F'}
                    icon='mdi:user-search'
                    width='24'
                    height='24'
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
          <Tooltip title='My organization'>
            <ListItem
              disablePadding
              onClick={() => navigate('/myorganization')}
              sx={{ display: 'block', marginTop: '20%' }}
            >
              <ListItemButton sx={listItemBtn}>
                <ListItemIcon sx={listItemIco}>
                  <Icon
                    color={url === 'myorganization' ? '#3770FF' : '#6A707F'}
                    icon='mingcute:building-2-fill'
                    width='24'
                    height='24'
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
          <Tooltip title='Find organizations'>
            <ListItem
              disablePadding
              onClick={() => navigate('/organizations')}
              sx={{ display: 'block', marginTop: '20%' }}
            >
              <ListItemButton sx={listItemBtn}>
                <ListItemIcon sx={listItemIco}>
                  <Icon
                    color={
                      url.includes('organizations') ? '#3770FF' : '#6A707F'
                    }
                    icon='mdi:briefcase-search'
                    width='24'
                    height='24'
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
      </Box>
      <Box></Box>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          sx={{
            marginLeft: '50px',
            backgroundColor: 'white',
            color: '#3770FF',
            boxShadow: '0px 1px 26px rgba(94, 99, 116, 0.05)',
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: {
                xs: 'space-between',
                sm: 'flex-end',
                md: 'flex-end',
              },
            }}
          >
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <div>
            {user && user.walletAddress && (
                <Button disabled style={{ marginRight: '10px' }}>
                  Scripts Balance: {pendingScripts}
                </Button>
              )}
              {user && user.walletAddress && (
                <Button onClick={() => setOpen2(true)} sx={btn} style={{ marginRight: '10px' }}>
                  Buy
                </Button>
              )}
              {user ? (
                <Button
                  onClick={async () => {
                    await auth.logout();
                    setUser(null);
                    setToken(null);
                    localStorage.setItem('ybUser', null);
                    localStorage.setItem('ybToken', null);
                    localStorage.setItem('ybBrand', null);
                  }}
                  sx={btn}
                >
                  Logout
                </Button>
              ) : (
                <Button onClick={() => setOpen(true)} sx={btn}>
                  SignIn/SignUp
                </Button>
              )}
              {user && user?.walletAddress && (
                <IconButton
                  onClick={() => navigate('/profile')}
                  sx={{ padding: '0', margin: '0', marginLeft: '10px', ...gridItem }}
                  edge='end'
                  aria-label='account of current user'
                  aria-haspopup='true'
                  color='inherit'
                >
                  <Avatar sx={{ backgroundColor: '#7382986c' }}>
                    {' '}
                    {user.username?.charAt(0).toUpperCase()}{' '}
                  </Avatar>
                </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Box
          component='nav'
          sx={{ flexShrink: { sm: 0 } }}
          aria-label='mailbox folders'
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant='permanent'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            hideBackdrop={false}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={
              mobileOpen
                ? {
                    display: 'block',
                    position: 'absolute',
                    zIndex: '6000',
                    '& .MuiDrawer-paper': {
                      boxSizing: 'border-box',
                      width: '200px',
                    },
                  }
                : { display: 'none' }
            }
          >
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5%',
                  marginTop: '5%',
                }}
              >
                <CardMedia
                  component='img'
                  image={logo}
                  sx={{ borderRadius: '50px', width: '50px', height: '50px' }}
                />
                <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                  onClick={handleDrawerToggle}
                >
                  <ArrowBackIosIcon sx={{ color: '#3770FF' }} />
                </IconButton>
              </Box>
              <Box>
                <List>
                  <ListItem
                    disablePadding
                    onClick={() => navigate('/')}
                    sx={{ display: 'block', marginTop: '10%' }}
                  >
                    <ListItemButton sx={listItemBtn}>
                      <ListItemIcon sx={listItemIco}>
                        <Icon
                          icon='material-symbols:home-rounded'
                          color={url === '' ? '#3770FF' : '#6A707F'}
                          width='26'
                          height='26'
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={
                          url === ''
                            ? { color: '#3770FF' }
                            : { color: '#6A707F' }
                        }
                        primary={'Dashboard'}
                      />
                    </ListItemButton>
                  </ListItem>

                  <ListItem
                    disablePadding
                    onClick={() => navigate('/chat')}
                    sx={{ display: 'block', marginTop: '10%' }}
                  >
                    <ListItemButton sx={listItemBtn}>
                      <ListItemIcon sx={{ ...listItemIco, marginLeft: '2px' }}>
                        <Icon
                          color={url.includes('chat') ? '#3770FF' : '#6A707F'}
                          icon='mdi:message'
                          width='20'
                          height='20'
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={
                          url.includes('chat')
                            ? { color: '#3770FF' }
                            : { color: '#6A707F' }
                        }
                        primary={'Chat'}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    disablePadding
                    onClick={() => navigate('/experts')}
                    sx={{ display: 'block', marginTop: '10%' }}
                  >
                    <ListItemButton sx={listItemBtn}>
                      <ListItemIcon sx={listItemIco}>
                        <Icon
                          color={url.includes('expert') ? '#3770FF' : '#6A707F'}
                          icon='mdi:user-search'
                          width='24'
                          height='24'
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={
                          url.includes('expert')
                            ? { color: '#3770FF' }
                            : { color: '#6A707F' }
                        }
                        primary={'Find experts'}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    disablePadding
                    onClick={() => navigate('/myorganization')}
                    sx={{ display: 'block', marginTop: '10%' }}
                  >
                    <ListItemButton sx={listItemBtn}>
                      <ListItemIcon sx={listItemIco}>
                        <Icon
                          color={
                            url === 'myorganization' ? '#3770FF' : '#6A707F'
                          }
                          icon='mingcute:building-2-fill'
                          width='24'
                          height='24'
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={
                          url === 'myorganization'
                            ? { color: '#3770FF' }
                            : { color: '#6A707F' }
                        }
                        primary={'My organization'}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    disablePadding
                    onClick={() => navigate('/organizations')}
                    sx={{ display: 'block', marginTop: '10%' }}
                  >
                    <ListItemButton sx={listItemBtn}>
                      <ListItemIcon sx={listItemIco}>
                        <Icon
                          color={
                            url.includes('organizations')
                              ? '#3770FF'
                              : '#6A707F'
                          }
                          icon='mdi:briefcase-search'
                          width='24'
                          height='24'
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={
                          url.includes('organizations')
                            ? { color: '#3770FF' }
                            : { color: '#6A707F' }
                        }
                        primary={'Find organizations'}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
              <Box></Box>
            </Box>
          </Drawer>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
      <LoginModal
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        setOpen={setOpen}
        user={user}
      />
      <BuyModal open={open2} handleSelectedPayment={handleSelectedPayment}  handleClose={handleClose2} user={user} />
      <BuyScriptModal open={selectedPaymentMethod=== 'crypto'} handleClose={()=>{setSelectedPaymentMethod(null)}} user={user} />
      <BuyCreditCardModal open={selectedPaymentMethod=== 'card'} handleClose={()=>{setSelectedPaymentMethod(null)}} user={user} />

      
    </>
  );
}
