import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Tshirt from './components/pages/NewProject/Tshirt.js'
import TshirtHome from './components/pages/NewProject/TshirtHome.js';
import TshirtReport from './components/pages/NewProject/TshirtReport.js';


function App() {



  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/' 
            //  element={<MainScreen/>}
            >
              <Route path='' element = {<TshirtHome/>}/>
              <Route path='tshirt/:projectName' element = {<Tshirt />}/>
              <Route path='tshirtReport/:projectName/:totalEfforts' element = {<TshirtReport />}/>
            </Route>
            
          </Routes>

        </BrowserRouter>
    </>
  );
}

export default App;
