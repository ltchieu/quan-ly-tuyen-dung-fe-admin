import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/main_layout'
import Dashboard from '../pages/dashboard'

type Props = {}

const AppRoute = (props: Props) => {
  return (
     <div>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Dashboard/>}></Route>
        </Route>
      </Routes>
    </div>

  )
}

export default AppRoute