
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './register/Register';
import Login from './Login/Login';
import Companies from './components/Companies';
import Accounts from './accounts/Accounts';
import AddUser from './accounts/AddUser';

function App() {
  return (
    <div className="App">
    <Router>
<Routes>
  <Route path='/register' element={ <Register/> } />
  <Route path='/login' element={ <Login/> } />
  <Route path='/company' element={ <Companies/> } />
  <Route path='/account' element={ <Accounts/> } />
  <Route path='/add' element={ <AddUser/> } />
  <Route path='/*' element={ <Login/> } />
</Routes>
    </Router>
    </div>
  );
}

export default App;
