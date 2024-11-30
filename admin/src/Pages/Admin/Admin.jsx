import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddAndEditProduct from '../../Components/AddAndEditProduct/AddAndEditProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'

function Admin() {
  return (
    <div className='admin'>
        <Sidebar />
        <Routes>
            <Route path='/addProduct' element={<AddAndEditProduct mode={'add'} />} />
            <Route path='/listProduct' element={<ListProduct />} />
            <Route path='/edit' element={<AddAndEditProduct mode={'edit'} />}>
              <Route path=':productId' element={<AddAndEditProduct mode={'edit'} />} />
            </Route>
        </Routes>
    </div>
  )
}

export default Admin