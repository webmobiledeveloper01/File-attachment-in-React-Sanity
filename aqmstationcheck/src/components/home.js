import React, { useEffect, useState } from 'react';
import "./home.css";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { client } from '../client.js';
import {userQuery} from './../utils/queries.js'
import Addsite from './addsite.js'
import Stations from './Stations';
import UserProfile from './UserProfile';
import NavBar from './nav/navBar';
import Analyzer from '../components/analyzer';
import Analyzers from './analyzers';
import CreatAnalyzerModel from './creatAnalyzerModel';
import StationDetails from './stationDetails'
import { getAnalyzers, getStations } from '../utils/helperFunctions';
import { notifyError } from '../utils/notifications.js';

function Home({setUser, user, userId, officeSelect, setOfficeSelect, setNetworkSelect, networkSelect}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [station, setStation] = useState([]);
  const [analyzers, setAnalyzers] = useState([]);
  const [creatAnalyzer, setCreateAnalyzer] = useState(false);
  
  if(!userId) {
    notifyError('Cannot find user information, try to login again!')
    setTimeout(() => {
      navigate("/login");
  }, 6000)
    
  }

  if(user === null || user === undefined) {
    const query = userQuery(userId);
    client.fetch(query)
        .then((data) => {
            setUser(data[0])
        })
  }

  useEffect(() => {
    setLoading(true);
    getAnalyzers(setAnalyzers, setLoading);
    getStations(setStation, setLoading);
  }, []);

  return (
    <div className='homeBox'>
      <NavBar user={user} />
        {
          !loading?
          <Routes>
            <Route path="/*" element={station && <Stations setOfficeSelect={setOfficeSelect}  officeSelect={officeSelect} station={station} loading={loading} setStation={setStation} user={user} setNetworkSelect={setNetworkSelect} networkSelect={networkSelect} analyzers={analyzers} setAnalyzers={setAnalyzers}/>}/>
            <Route path='/user-profile/:userId' element={<UserProfile currentUserId={user?._id}/>} />
            <Route exact path='/newsite' element = { <Addsite user={user} analyzers={analyzers} setAnalyzers={setAnalyzers} setCreateAnalyzer={setCreateAnalyzer} setStation={setStation} station={station}/>} />
            <Route path='/analyzer/:analyzerId' element={ <Analyzer userId={user?._id} user={user} setAnalyzers={setAnalyzers} analyzers={analyzers}/> }/>
            <Route path='/stationDetails/:stationId' element={<StationDetails userId={user?._id}  user={user} analyzers={analyzers} setAnalyzers={setAnalyzers} station={station} setStation={setStation} setCreateAnalyzer={setCreateAnalyzer}/> }/>
            <Route path='/analyzers' element={ <Analyzers analyzers={analyzers} setCreateAnalyzer={setCreateAnalyzer} creatAnalyzer={creatAnalyzer} user={user} /> }/>
          </Routes>
          
          :
          <div> </div>
        }
        
        {
            creatAnalyzer === true && (
                <CreatAnalyzerModel
                  analyzers={analyzers}
                  setAnalyzers={setAnalyzers}
                  creatAnalyzer={creatAnalyzer}
                  setCreateAnalyzer={setCreateAnalyzer}
                  userId={user?._id}
                />   
              )
        }
       
    </div>
      
  )
}

export default Home;
