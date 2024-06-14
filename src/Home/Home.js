// src/App.js

import { React, useEffect } from 'react';
import SidebarMenu from '../slideBar/SlideBar';
import './Home.css'
import logo from '../logo.svg';

function Home() {
  
  return (
    <div className="centered">
      <SidebarMenu />
      
    </div>
  );
}

export default Home;
