import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ybcontext } from './context/MainContext';
import MainRouter from './router/MainRouter';
import Loading from './components/loader/Loading';
import SideDrawer from './components/sidebar/SideDrawer';

function App() {
  return (
    <>
      <ybcontext.Provider >
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
