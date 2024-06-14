import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home/Home';
import NotFound from './NotFound/NotFound';
import Login from './Login/Login';
import Register from './Register/Register';
import PasswordReset from './resetPass/resetPass';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPassword" element={<PasswordReset />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
