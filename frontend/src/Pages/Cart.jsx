import React from 'react'
import CartItems from '../Components/CartItems/CartItems'
import MenuBottomTabs from '../Components/MenuBottomTabs/MenuBottomTabs'

import './CSS/Cart.css'

function Cart() {
  return (
    <>
      <div className='cart'>
        <CartItems />
      </div>
      <MenuBottomTabs active={'Home'} />
    </>
  )
}

export default Cart