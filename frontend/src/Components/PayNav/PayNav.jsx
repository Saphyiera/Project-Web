import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function PayNav() {
    const navigate = useNavigate();
    const location = useLocation();

  return (
    <div className="pay-nav">
        <div 
            onClick={() => navigate('/pay/payment-info')} 
            className={`pay-nav__item ${location.pathname === '/pay/payment-info' ? 'pay-nav__item--active' : ''}`}
        >
            <span>1. Thông tin</span>
        </div>
        <div 
            onClick={() => navigate('/pay/payment')} 
            className={`pay-nav__item ${location.pathname === '/pay/payment' ? 'pay-nav__item--active' : ''}`}
        >
            <span>2. Thanh toán</span>
        </div>
    </div>
  )
}

export default PayNav