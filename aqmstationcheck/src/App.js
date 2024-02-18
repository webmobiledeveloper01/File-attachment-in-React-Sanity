import { useState } from 'react';
import Home from './components/home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Sign_Up from './components/userAuth/Sign_Up';
import Login from './components/userAuth/Login';

function App() {
  const userId = localStorage.getItem('UserId');
  const officeName = localStorage.getItem('Office');
  const networkName = localStorage.getItem('Network');
  const [user, setUser] = useState(null);
  const [officeSelect, setOfficeSelect] = useState(officeName);
  const [networkSelect, setNetworkSelect] = useState(networkName);
  const [newUser, setNewUser] = useState(null);
  
  
  return (
    
      <BrowserRouter>
        <Routes>
          <Route exact path='/*' element={<Home setUser={setUser} user={user} userId={userId} setOfficeSelect={setOfficeSelect} officeSelect={officeSelect} setNetworkSelect={setNetworkSelect} networkSelect={networkSelect}/>}/>
          <Route exact path='/login' element = { <Login setUser={setUser} newUser={newUser} user={user}/>}/>
          <Route exact path='/signUp' element = { <Sign_Up setNewUser={setNewUser}/>}/>   
        </Routes>
      </BrowserRouter>
  );
}

export default App;
