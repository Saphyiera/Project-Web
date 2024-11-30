import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios'
import moment from 'moment'

import './CSS/Order.css'

function Order() {
    const { formatPrice } = useContext(ShopContext);
    const [listOrders, setListOrders] = useState([]);
    const [totalOrdersCost, setTotalOrderCost] = useState(0);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const fetchAllOrders = async () => {
        const response = await axios.post('http://localhost:4000/order/get', {
            status: status
        }, {
            headers: {
                'auth-token': `${localStorage.getItem('auth-token')}`
            }
        })

        if (response.data.success) {
            setListOrders(response.data.orders);
            let total = 0;
            await response.data.orders.forEach(order => {
                total += order.total;
            });
            setTotalOrderCost(total);
        } else {
            setListOrders([]);
            setTotalOrderCost(0);
        }
    }

    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            fetchAllOrders();
        } else {
            navigate('/login')
        }
    }, [navigate, status])

    const handleCheckout = async (order) => {
        try {    
            if (order.payment_modal === 'VNPAY') {
              const response = await axios.post('http://localhost:4000/pay/vnpay/create_payment_url', {
                orderId: order._id,
                amount: order.total,
                orderType: 110000
              })
              
              if (response.data && response.data.redirectUrl) {
                // Chuyển hướng người dùng đến URL thanh toán
                window.open(response.data.redirectUrl, '_blank');
              }
            }
        } catch (error) {
          console.log(error);
        }
      }

  return (
    <div className='order container body'>
        <div className="order-page">
            <div className="order-mobile">
                <div className="background"></div>
                <div className="block-homepage-menu">
                    <div className="block-homepage-menu__content">
                        <div className="content__item">
                            <p className="item__content title">{listOrders.length}</p>
                            <p className="item__content text">đơn hàng</p>
                        </div>
                        <div className="content__item">
                            <p className="item__content title">{formatPrice(totalOrdersCost)}</p>
                            <p className="item__content text">Tổng tiền tích luỹ</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="block-order">
                        <div className="block-sliding-order">
                            <div className="options-item calendar"></div>
                            <div className="order-history-container gallery-thumbs">
                                <div className="thumbs-wrapper">
                                    <div 
                                        onClick={() => setStatus("")} 
                                        className={`thumb-item ${status === '' && 'swiper-slide-thumb-active'}`}
                                    >
                                        Tất cả
                                    </div>
                                    <div 
                                        onClick={() => setStatus("Chờ xác nhận")} 
                                        className={`thumb-item ${status === 'Chờ xác nhận' && 'swiper-slide-thumb-active'}`}
                                    >
                                        Chờ xác nhận
                                    </div>
                                    <div 
                                        onClick={() => setStatus("Đã xác nhận")} 
                                        className={`thumb-item ${status === 'Đã xác nhận' && 'swiper-slide-thumb-active'}`}
                                    >
                                        Đã xác nhận
                                    </div>
                                    <div 
                                        onClick={() => setStatus("Đang vận chuyển")} 
                                        className={`thumb-item ${status === 'Đang vận chuyển' && 'swiper-slide-thumb-active'}`}
                                    >
                                        Đang vận chuyển
                                    </div>
                                    <div 
                                        onClick={() => setStatus("Đã giao hàng")} 
                                        className={`thumb-item ${status === 'Đã giao hàng' && 'swiper-slide-thumb-active'}`}
                                    >
                                        Đã giao hàng
                                    </div>
                                    <div 
                                        onClick={() => setStatus("Đã huỷ")} 
                                        className={`thumb-item ${status === 'Đã huỷ' && 'swiper-slide-thumb-active'}`}
                                    >
                                        Đã huỷ
                                    </div>
                                </div>
                            </div>
                            <div id="listOrder" className="list-order-wrapper">
                                <div className="block-order-list">
                                    {
                                        listOrders.map((order, index) => {
                                            return (
                                                <div key={index} className="block-order-item">
                                                    <div className="order-item">
                                                        <div className="order-item__img">
                                                            <img src={order.products[0].image} alt="product" loading='lazy' />
                                                        </div>
                                                        <div className="order-item__info">
                                                            <div className="info__title button__order-detail">
                                                                <span onClick={() => navigate(`/order/order-detail/${order._id}`)}>{order.products[0].name} - {order.products[0].color}</span>
                                                                <p>{moment(order.date).format('DD/MM/YYYY HH:mm')}</p>
                                                            </div>
                                                            <div style={{display: "flex", alignItems: "center"}}>
                                                                <div className="info__sub-title">
                                                                    {order.products.length > 1 && `và ${order.products.length - 1} sản phẩm khác`}
                                                                </div>
                                                            </div>
                                                            <div className="info__status">
                                                                {
                                                                    (order.status !== "Đã huỷ" && order.status !== "Đã giao hàng") &&
                                                                    <div className={`order-payment-status ${order.payment_status ? 'paid' : 'unpaid'}`}>
                                                                        {order.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                                    </div>
                                                                }
                                                                <div className={`order-status ${order.status === "Đã huỷ" && 'cancelled'} ${order.status === "Đã giao hàng" && 'done'}`}>
                                                                    {order.status}
                                                                </div>
                                                            </div>
                                                            <div className="info__group">
                                                                <div className="price">{formatPrice(order.total)}</div>
                                                                <div className="group-btn-info">
                                                                    {
                                                                        (
                                                                            order.status !== "Đã huỷ" && 
                                                                            order.status !== "Đã giao hàng" && 
                                                                            order.payment_modal !== "Thanh toán khi nhận hàng" &&
                                                                            order.payment_status === 0
                                                                        ) &&
                                                                        <div onClick={() => handleCheckout(order)} className="btn-info">Thanh toán đơn hàng</div>
                                                                    }
                                                                    <div onClick={() => navigate(`/order/order-detail/${order._id}`)} className="btn-info">Xem chi tiết</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Order