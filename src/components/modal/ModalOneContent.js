import { Button, CardMedia, Grid, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
// import { useWeb3React } from '@web3-react/core'
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { connectArcana, connectMetaMask } from '../../services/connectors';
import { isMobile } from 'react-device-detect';
// import { InjectedConnector } from '@web3-react/injected-connector'
import { ybcontext } from '../../context/MainContext';
import { detect } from 'detect-browser';

const style = {
  btn: {
    display: 'flex',
    padding: { md: '5px', xs: '0px' },
    width: '100%',
    cursor: 'pointer',
    borderRadius: '10px',
    backgroundColor: '#808080',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    textTransform: 'none',
  },
  img: { width: '100px' },
  heading: {
    fontFamily: 'Poppins',
    margin: 0,
    padding: 0,
    fontWeight: 'bold',
    color: 'black',
  },
  ptag: { margin: 0, padding: 0, fontSize: '10px', color: '#4e4e4e' },
  gridItem: {
    padding: { md: '10px', xs: '5px' },
    height: { md: '100%', xs: 'auto' },
  },
  gridContainer: { margin: '5% 0' },
};

function ModalOneContent({ activeStep, setActiveStep, onboarding, video }) {
  // const { activate } = useWeb3React();
  const {
    user,
    setUser,
    account,
    setAccount,
    token,
    setToken,
    setUserBrand,
    initializeWeb3,
    auth,
  } = useContext(ybcontext);
  const browser = detect();
  console.log(browser);
  // const Injected = new InjectedConnector({
  //     supportedChainIds: [1, 3, 4, 5, 42]
  // });

  const [isCommingFromMovieProfessional, setIsCommingFromMovieProfessional] = useState(false)


//   if (activeStep === 0 && isCommingFromMovieProfessional) {
//     setActiveStep((prevActiveStep) => prevActiveStep + 2);
// }


  React.useEffect(() => {
    const getTitleFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("title");
    };
    const title = getTitleFromUrl();

    if (title === 'Movie Professionals') {
        setIsCommingFromMovieProfessional(true)

    }
}, []);


  useEffect(() => {
    if(activeStep === 0 && isCommingFromMovieProfessional){
      setActiveStep(2)
      return
    }
    if (user !== null && user?.walletAddress) {
      if (
        user.videoIntro === '' &&
        (!user.email ||
          user.email === '' ||
          user.email === null ||
          user.email === undefined)
      ) {
        setActiveStep(activeStep + 1);
      } else if (user.videoIntro === null || user.videoIntro === undefined) {
        setActiveStep(activeStep + 1);
      } else if (
        !user.email ||
        user.email === '' ||
        user.email === null ||
        user.email === undefined
      ) {
        setActiveStep(activeStep + 2);
      } else {
        setActiveStep(activeStep + 4);
      }
    }
  }, [user]);
  // console.log(user, account, "modalonek")

  return (
    <>
      <Grid container sx={style.gridContainer}>
        {
          // onboarding ? <iframe
          //     title="MetaMask Download"
          //     src="https://metamask.io/download.html"
          //     style={{ display: 'block', height:'60vh', width:'100%' }}
          // /> :
          <Grid item container md={12}>
            <Grid item md={12} sm={12} xs={12} sx={style.gridItem}>
              <Button
                onClick={() => {
                  try {
                    // activate(Injected)
                    var elements = document.getElementsByClassName(
                      'MuiBox-root css-lqhh04'
                    );

                    for (var i = 0; i < elements.length; i++) {
                      var element = elements[i];
                      element.removeAttribute('tabIndex');
                    }

                    connectArcana(
                      user,
                      setUser,
                      account,
                      setAccount,
                      token,
                      setToken,
                      setUserBrand,
                      initializeWeb3,
                      auth
                    );
                  } catch (e) {
                    console.log(e);
                  }
                }}
                sx={style.btn}
              >
                <CardMedia
                  sx={style.img}
                  component='img'
                  image='https://dashboard.arcana.network/assets/logo.e5e5689a.svg'
                />
                <Typography variant='h6' sx={style.heading}>
                  SignIn/SignUp
                </Typography>
                {/* <p style={style.ptag}>Connect Wallet</p> */}
              </Button>
            </Grid>
          </Grid>
        }
      </Grid>
    </>
  );
}

export default ModalOneContent;
