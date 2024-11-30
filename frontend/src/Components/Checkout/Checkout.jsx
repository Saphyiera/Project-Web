import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

import './Checkout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

function Checkout({ order, getTotalCost }) {
    const { formatPrice } = useContext(ShopContext);
    const navigate = useNavigate();

  return (
    <div className='checkout'>
        <div className="checkout-container">
            <div className="checkout__main">
                <div className="checkout-main__success">
                    <div className="checkout-main__success-icon">
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </div>
                    <span>Đặt hàng thành công</span>
                </div>
                <div className="checkout-main__details">
                    <div className="checkout-main__details-item">
                        <p className="details-item__title">Mã Đơn Hàng</p>
                        <p className="details-item__value">{order.id}</p>
                    </div>
                    <div className="checkout-main__details-item">
                        <p className="details-item__title">Người Nhận</p>
                        <p className="details-item__value">{order.customer_name}</p>
                    </div>
                    <div className="checkout-main__details-item">
                        <p className="details-item__title">Số Điện Thoại</p>
                        <p className="details-item__value">{order.phone}</p>
                    </div>
                    <div className="checkout-main__details-item">
                        <p className="details-item__title">Nhận Sản Phẩm Tại</p>
                        <p className="details-item__value">
                        {
                            order.address.province ?
                            `${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.province}` :
                            ''
                        }
                        </p>
                    </div>
                    <div className="checkout-main__details-item">
                        <p className="details-item__title">Hình Thức Thanh Toán</p>
                        <p className="details-item__value">{order.payment_modal}</p>
                    </div>
                    <div className="checkout-main__details-item">
                        <p className="details-item__title">Tổng Tiền</p>
                        <p className="details-item__value">{formatPrice(getTotalCost())}</p>
                    </div>
                </div>
            </div>
            <div className="checkout-buttons">
                <button onClick={() => navigate(`/order/order-detail/${order.id}`)} className="btn btn-danger">Kiểm tra đơn hàng</button>
                <button onClick={() => navigate('/')} className="btn">Về trang chủ</button>
            </div>
        </div>
    </div>
  )
}

export default Checkout