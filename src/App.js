import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Tshirt from './components/pages/NewProject/Tshirt.js'
import TshirtHome from './components/pages/NewProject/TshirtHome.js';
import TshirtReport from './components/pages/NewProject/TshirtReport.js';
import LoginPage from './login_signUp/login.js';
import SignupPage from './login_signUp/signUp.js';

function App() {



  return (
    <>
        <BrowserRouter>
          {/* <Routes> */}
            {/* <Route path='/' > */}
              {/* <Route path='/' element = {<TshirtHome/>}/> */}
              {/* <Route path='tshirt/:projectName' element = {<Tshirt />}/> */}
              {/* <Route path='tshirtReport/:projectName/:totalEfforts' element = {<TshirtReport />}/> */}
            {/* </Route> */}
          {/* </Routes> */}
          <Routes>
            <Route path='/' element = {<LoginPage/>} />
            <Route path='/signup' element = {<SignupPage/>}/>
            <Route path='/home' element = {<TshirtHome/>}/>
            <Route path='tshirt/:projectName' element = {<Tshirt />}/>
            <Route path='tshirtReport/:projectName/:totalEfforts' element = {<TshirtReport />}/>
          </Routes>

        </BrowserRouter>
    </>
  );
}

export default App;
