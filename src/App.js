import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ybcontext } from './context/MainContext';
import MainRouter from './router/MainRouter';
import Loading from './components/loader/Loading';
import SideDrawer from './components/sidebar/SideDrawer';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null)
  const [account, setAccount] = useState(null)
  const [token, setToken] = useState(null)
  const [userBrand, setUserBrand] = useState(null)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)


  const context = {
    user, setUser,
    account, setAccount,
    token, setToken,
    userBrand, setUserBrand,
    open, setOpen,
    edit, setEdit
  }

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("ybUser")))
    setToken(localStorage.getItem("ybToken"))
    setUserBrand(JSON.parse(localStorage.getItem("ybBrand")))
  }, [account])

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("ybUser")))
    setToken(localStorage.getItem("ybToken"))
    setUserBrand(JSON.parse(localStorage.getItem("ybBrand")))
  }, [])

  return (
    <>
      <ybcontext.Provider value={context}>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
