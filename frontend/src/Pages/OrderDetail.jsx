import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios'
import moment from 'moment'

import './CSS/OrderDetail.css'
import paymentIcon from '../Components/Assets/payment.png'
import customerIcon from '../Components/Assets/customer_icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useContext(ShopContext);
  const [order, setOrder] = useState({});
  const [isProductList, setIsProductList] = useState(false);

  const fetchOrder = async () => {
    const response = await axios.get(`http://localhost:4000/order/get/${orderId}`, {
      headers: {
        'auth-token': `${localStorage.getItem('auth-token')}`
      }
    })

    if (response.data.success) {
      setOrder(response.data.order);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [])

  return (
    <div className='order-detail container body'>
      <div className="order-detail-page">
        <div className="order-detail-mobile">
          <div className="background"></div>
          <div className="top-nav-bar">
            <div onClick={() => navigate('/order')} className="navbar-container">
              <div>
                <div className="go-back-icon">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>
              </div>
              <div className="nav-bar__title">
                Chi tiết đơn hàng
              </div>
            </div>
          </div>
          <div className="container">
            <div className="block-order-detail">
              <div className="order-detail__code">
                <p className="code__name">
                  Mã đơn hàng: <strong>{order._id}</strong>
                </p>
                <div className="info__status">
                  {
                    (order.status !== "Đã huỷ" && order.status !== "Đã giao hàng") &&
                    <div style={{marginTop: 0}} className={`order-payment-status ${order.payment_status ? 'paid' : 'unpaid'}`}>
                      {order.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </div>
                  }
                  <div style={{marginTop: 0}} className={`order-status ${order.status === "Đã huỷ" && 'cancelled'} ${order.status === "Đã giao hàng" && 'done'}`}>
                    {order.status}
                  </div>
                </div>
              </div>
              <div className="order-detail__date">
                {moment(order.date).format('DD/MM/YYYY HH:mm')}
              </div>
              <div className="order-detail__products">
                <div className="block-product-list">
                  <div className="product-list">
                    <div className="product-list-container">
                      {
                        order.products &&
                        order.products.map((product, index) => {
                          if (index !== 0 && isProductList === false) return null;
                          return (
                            <div key={index} className="block-order-item detail-page">
                              <div className="order-item">
                                <div className="order-item__img">
                                  <img src={product.image} alt="product" loading='lazy' />
                                </div>
                                <div className="order-item__info">
                                  <Link
                                    target='_blank'
                                    rel='noopener'
                                    to={`/product/${product.productId}`}
                                    className='info__title'
                                  >
                                    {product.name} - {product.color}
                                  </Link>
                                  <div className="info__sub-title">
                                    <div className="sub-title__item">{product.color}</div>
                                    <div className="sub-title__quantity">
                                      Số lượng: <p>1</p>
                                    </div>
                                  </div>
                                  <div style={{flexDirection: "column"}} className="info__group">
                                    <div className="group-btn-info">
                                      <div className="btn-info">Đánh giá</div>
                                      <div onClick={() => navigate(`/product/${product.productId}`)} className="btn-info">Mua lại</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div onClick={() => setIsProductList(!isProductList)} className="btn-product-list">
                      <p className="btn-show-all">
                        {
                          isProductList ?
                          'thu gọn' :
                          `và ${order.products && order.products.length - 1} sản phẩm khác`
                        }
                      </p>
                      <div className="show-all-icon">
                        {
                          isProductList ?
                          <FontAwesomeIcon icon={faChevronUp} /> :
                          <FontAwesomeIcon icon={faChevronDown} />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-detail__payment-info">
                <div className="payment-info payment">
                  <div className="payment-info__title">
                    <img src={paymentIcon} alt="" className="title__img" />
                    <p className="title__text">Thông tin thanh toán</p>
                  </div>
                  <div className="payment-info__content">
                    <div className="content__item">
                      <p className="item-title">Tổng tiền sản phẩm:</p>
                      <p>{formatPrice(order.old_total || 0)}</p>
                    </div>
                    <div className="content__item">
                      <p className="item-title">Giảm giá:</p>
                      <p>{formatPrice((order.old_total - order.total) || 0)}</p>
                    </div>
                    <div className="content__item">
                      <p className="item-title">Phí vận chuyển:</p>
                      <p>Miễn phí</p>
                    </div>
                    <div className="content__item border-top">
                      <p className="item-title">Phải thanh toán:</p>
                      <p style={{fontWeight: 700}}>{formatPrice(order.total || 0)}</p>
                    </div>
                    {
                      order.payment_status === 1 &&
                      <div className="content__item">
                        <p className="item-title">Đã thanh toán:</p>
                        <p style={{fontWeight: 700}}>{formatPrice(order.total)}</p>
                      </div>
                    }
                    {
                      order.payment_status === 0 &&
                      <div className="content__item last-item-money">
                        <p className="item-title">Còn phải thanh toán:</p>
                        <p style={{fontWeight: 700}}>{formatPrice((1 - order.payment_status) * order.total)}</p>
                      </div>
                    }
                  </div>
                </div>
                <div className="payment-info customer">
                  <div className="payment-info__title">
                    <img src={customerIcon} alt="" className="title__img" />
                    <p className="title__text">Thông tin khách hàng</p>
                  </div>
                  <div className="payment-info__content">
                    <div className="content__item">
                      <div className="item__icon">
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12.96C14.7614 12.96 17 10.7214 17 7.95996C17 5.19854 14.7614 2.95996 12 2.95996C9.23858 2.95996 7 5.19854 7 7.95996C7 10.7214 9.23858 12.96 12 12.96Z" stroke="#717171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M20.5901 22.96C20.5901 19.09 16.7402 15.96 12.0002 15.96C7.26015 15.96 3.41016 19.09 3.41016 22.96" stroke="#717171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </div>
                      <div className="item__text">
                        {order.customer_name}
                      </div>
                    </div>
                    <div className="content__item">
                      <div className="item__icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="#717171" stroke-width="1.5" stroke-miterlimit="10"></path>
                        </svg>
                      </div>
                      <div className="item__text">
                        {order.phone}
                      </div>
                    </div>
                    <div className="content__item">
                      <div className="item__icon">
                      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9989 14.3904C13.722 14.3904 15.1189 12.9935 15.1189 11.2704C15.1189 9.54726 13.722 8.15039 11.9989 8.15039C10.2758 8.15039 8.87891 9.54726 8.87891 11.2704C8.87891 12.9935 10.2758 14.3904 11.9989 14.3904Z" stroke="#717171" stroke-width="1.5"></path> <path d="M3.62166 9.44996C5.59166 0.789963 18.4217 0.799963 20.3817 9.45996C21.5317 14.54 18.3717 18.84 15.6017 21.5C13.5917 23.44 10.4117 23.44 8.39166 21.5C5.63166 18.84 2.47166 14.53 3.62166 9.44996Z" stroke="#717171" stroke-width="1.5"></path>
                      </svg>
                      </div>
                      <div className="item__text">
                        {order.address}
                      </div>
                    </div>
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

export default OrderDetail