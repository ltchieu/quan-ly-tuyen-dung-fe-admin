import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/main_layout'
import Dashboard from '../pages/dashboard'
import Login from '../auth/login'

type Props = {}

const AppRoute = (props: Props) => {
  return (
     <div>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Dashboard/>}></Route>
        </Route>
        <Route path='/login' element={<Login/>}></Route>
      </Routes>
    </div>

  )
}

export default AppRoute