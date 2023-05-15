import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
// import React, { useContext, useEffect } from 'react'
// import { Outlet, Navigate } from 'react-router-dom';

export default function MainRouter() {
    // function PrivateRouter() {
    //     const { user, setUser, setOpen } = useContext(offerContext)
    //     return user !== null ? <>
    //         <Outlet />
    //     </> : <>
    //         {
    //             JSON.parse(localStorage.getItem("deOffersUser")) === null && setOpen(true)
    //         }
    //         <Navigate to="/" />
    //     </>
    // }

    // useEffect(() => {
    //     setUser(JSON.parse(localStorage.getItem("deOffersUser")))
    // }, [])

    return (
        <>
            <Routes>
                <Route exact path='/' element={<HomePage />} />
                {/* <Route exact path='/achemyintegration' element={<AlchemyIntegration />} />
                <Route path='/redeemoffer' element={<PrivateRouter />} >
                    <Route exact path='/redeemoffer' element={<BurnNFTPage />} />
                </Route> */}
            </Routes>
        </>
    )
}