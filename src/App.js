import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
// import FlatFile from './components/pages/Connections/FlatFile/flatFile';
import CreateProject from './components/pages/Project/CreateProject';
import MainScreen from './components/pages/MainScreen/MainScreen';
import MySqlForm from './components/pages/Connections/Forms/MySqlForm';
import HanaForm from './components/pages/Connections/Forms/HanaForm';
import ErpForm from './components/pages/Connections/Forms/ErpForm';
import OracleForm from './components/pages/Connections/Forms/OracleForm';
import ViewConnection from './components/pages/Connections/ViewConnections/ViewConnection';
import LandingPage from './components/pages/LandingPage';
import ManageProjects from './components/pages/Project/ManageProjects';
import ViewSapTables from './components/pages/Connections/ViewConnections/ViewSapTables';
import ViewHanaTables from './components/pages/Connections/ViewConnections/ViewHanaTables';
import ExcelFile from './components/pages/Connections/FlatFile/excelFile.js';
import TextFile from './components/pages/Connections/FlatFile/TextFile';
import CSVFile from './components/pages/Connections/FlatFile/CSVFile';
import XMLFile from './components/pages/Connections/FlatFile/XMLFile'
import BusinessRules from './components/pages/BusinessRules/BusinessRules.js';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import CreateBussinessRules from './components/onePage.js';
import Reports from './components/reports.js';
import Tshirt from './components/pages/NewProject/Tshirt.js'
import TshirtHome from './components/pages/NewProject/TshirtHome.js';
import TshirtReport from './components/pages/NewProject/TshirtReport.js';


function App() {



  return (
    <>
        <BrowserRouter>
          <Routes>
            {/* MainScreen Route*/}
            <Route path="/" element={<MainScreen/>} >
              <Route index element={<LandingPage/>}/>
              <Route path='onpage' element={<CreateBussinessRules/>}/>
              <Route path='report' element={<Reports/>}/>
            </Route>

            {/* Project Routes */}
            <Route path='/project' element={<MainScreen/>} >
            <Route path='createproject' element={<CreateProject/>}/>
            <Route path='manageprojects' element={<ManageProjects/>}/>
            </Route>

            <Route path='/newProject' 
            //  element={<MainScreen/>}
            >
              <Route path='home' element = {<TshirtHome/>}/>
              <Route path='tshirt/:projectName' element = {<Tshirt />}/>
              <Route path='tshirtReport/:projectName/:totalEfforts' element = {<TshirtReport />}/>
            </Route>

            {/* Connections Routes */}
            <Route path="/connections" element={<MainScreen/>}>
              <Route path='mysql' element={<MySqlForm/>}/>
              <Route path='mysql/:id/:project_id' element={<MySqlForm/>}/>
              <Route path='hana' element={<HanaForm/>}/>
              <Route path='hana/:id/:project_id' element={<HanaForm/>}/>
              <Route path='erp' element={<ErpForm/>}/>
              <Route path='erp/:id/:project_id' element={<ErpForm/>}/>
              <Route path='oracle' element={<OracleForm/>}/>
              <Route path='oracle/:id/:project_id' element={<OracleForm/>}/>
              {/* <Route path='flatfile' element={<FlatFile/>} /> */}
              <Route path='view-connections' element={<ViewConnection/>} />
              <Route path='view-tables' element={<ViewSapTables/>} />
              <Route path='view-tables/:id/:conn_name' element={<ViewHanaTables/>} />
              <Route path='excel' element={<ExcelFile/>} />
              <Route path='text' element={<TextFile />} />
              <Route path='csv' element={<CSVFile />} />
              <Route path='xml' element={<XMLFile />} />
            </Route>
            
            {/* Workspace Routes*/}
            <Route path="/workspace" element={<MainScreen/>}>
                <Route path='extractions' element={''}/>
                <Route path='cleanse' element={''}/>
                <Route path='cleansedata' element={''}/>
                <Route path='transformdata' element={''}/>
                <Route path='preload' element={''}/>
                <Route path='load' element={''}/>
                <Route path='reconsile' element={''}/>
            </Route>

            {/* BusinessRules */}
            <Route path='/bussinessrules' element={<BusinessRules/>}></Route>
            
          </Routes>

        </BrowserRouter>
    </>
  );
}

export default App;
