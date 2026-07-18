import { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import GoldDashboard from '../src/dashboard/GoldDashboard'
import InvestmentTab from '../src/invest/InvestmentTab'
import LoginPage from '../src/login/LoginPage'
import HeaderTab from '../src/Navbar/Header'
import Transaction from '../src/transaction/Transaction'
import './App.css'

function MainLayout() {
  return (
    <>
      <HeaderTab />
      <Outlet />
    </>
  );
}

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>   
          <Route path='/invest' element={<InvestmentTab/>}/>
          <Route path='/dashboard' element={<GoldDashboard/>}/>
          <Route path='/' element={<GoldDashboard/>}/>
          <Route path='/transaction' element={<Transaction />} />
      </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
