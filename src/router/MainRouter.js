import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchExperts from '../pages/SearchExperts';
import Details from '../pages/Details';
import ChatWithUser from '../pages/ChatWithUser';
import { ybcontext } from '../context/MainContext';
import { useContext, useEffect } from 'react';
import DetailsOrgPage from '../pages/DetailsOrgPage';
import SearchOrg from '../pages/SearchOrg';
import MyOrg from '../pages/MyOrg';
import Myprofile from '../pages/Myprofile';
import AgreementDets from '../pages/AgreementDets';
// import React, { useContext, useEffect } from 'react'
// import { Outlet, Navigate } from 'react-router-dom';

export default function MainRouter() {
    const { user, setUser, setOpen } = useContext(ybcontext)
    function PrivateRouter() {
        return user !== null ? <>
            <Outlet />
        </> : <>
            {
                JSON.parse(localStorage.getItem("ybUser")) === null && setOpen(true)
            }
            <Navigate to="/" />
        </>
    }

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("ybUser")))
    }, [])

    return (
        <>
            <Routes>
                <Route exact path='/:title?' element={<HomePage />} />
                <Route exact path='/experts' element={<SearchExperts />} />
                <Route exact path='/experts-details/:id' element={<Details />} />
                <Route exact path='/organizations' element={<SearchOrg />} />
                <Route exact path='/organizations-details/:id' element={<DetailsOrgPage />} />

                {/* <Route exact path='/achemyintegration' element={<AlchemyIntegration />} /> */}
                <Route path='/agreement/details/:id' element={<PrivateRouter />} >
                    <Route exact path='/agreement/details/:id' element={<AgreementDets/>} />
                </Route>
                <Route path='/myorganization' element={<PrivateRouter />} >
                    <Route exact path='/myorganization' element={<MyOrg />} />
                </Route>
                <Route path='/profile' element={<PrivateRouter />} >
                    <Route exact path='/profile' element={<Myprofile />} />
                </Route>
                <Route path='/chat/:id' element={<PrivateRouter />} >
                    <Route exact path='/chat/:id' element={<ChatWithUser />} />
                </Route>
                <Route path='/chat' element={<PrivateRouter />} >
                    <Route exact path='/chat' element={<ChatWithUser />} />
                </Route>
            </Routes>
        </>
    )
}