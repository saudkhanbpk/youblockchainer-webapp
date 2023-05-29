import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ybcontext } from './context/MainContext';
import MainRouter from './router/MainRouter';
import Loading from './components/loader/Loading';
import SideDrawer from './components/sidebar/SideDrawer';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null)
  const [account, setAccount] = useState(null)
  const [token, setToken] = useState(null)
  const [userBrand, setUserBrand] = useState(null)
  const [open, setOpen] = useState(false)

  const context = {
    user, setUser,
    account, setAccount,
    token, setToken,
    userBrand, setUserBrand,
    open, setOpen
  }

  return (
    <>
      <ybcontext.Provider value={context}>
        <Router>
          {/* {
            loadOnAccChange ? <Loading /> : <MainRouter />
          } */}
          <SideDrawer>
            <MainRouter />
          </SideDrawer>
        </Router>
      </ybcontext.Provider>
    </>
  );
}

export default App;
