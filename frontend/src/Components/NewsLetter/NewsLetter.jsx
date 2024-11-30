import React from 'react'

import './NewsLetter.css'

function NewsLetter() {
  return (
    <div className='newsletter'>
        <h1>Đăng ký nhận tin khuyến mãi</h1>
        <p>(*) Nhận ngay voucher 10%</p>
        <div>
            <input type="email" placeholder='Your Email' />
            <button>Subcribe</button>
        </div>
    </div>
  )
}

export default NewsLetter