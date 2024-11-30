import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../../Context/ShopContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import './PaymentInfo.css'
import Dropdown from '../Dropdown/Dropdown';

function PaymentInfo({ order, handleChange }) {
  const { formatPrice } = useContext(ShopContext);
  const [isViewList, setIsViewList] = useState(false);

  const [address, setAddress] = useState(order.address);
  
  const [provinceList, setProvinceList] = useState([])
  const [isProvinceDropdown, setIsProvinceDropdown] = useState(false)
  const [provinceID, setProvinceID] = useState();

  const [districtList, setDistrictList] = useState([])
  const [isDistrictDropdown, setIsDistrictDropdown] = useState(false)
  const [districtID, setDistrictID] = useState();

  const [wardList, setWardList] = useState([])
  const [isWardDropdown, setIsWardDropdown] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:4000/address/province')
      .then(res => {
        setProvinceList(res.data)
      })

    const handleOutsideClick = (e) => {
      if (e.target.name !== 'province') {
        setIsProvinceDropdown(false);
      }

      if (e.target.name !== 'district') {
        setIsDistrictDropdown(false);
      }

      if (e.target.name !== 'ward') {
        setIsWardDropdown(false);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => {
        document.removeEventListener("click", handleOutsideClick);
    };
  }, [])
  
  useEffect(() => {
    if (!provinceID || !address.province) {
      setDistrictList([]);
    } else {
      axios.get(`http://localhost:4000/address/district/${provinceID}`)
        .then(res => {
          setDistrictList(res.data)
        })
    }
  }, [provinceID, address.province])

  useEffect(() => {
    if (!districtID || !address.district) {
      setWardList([]);
    } else {
      axios.get(`http://localhost:4000/address/ward/${districtID}`)
        .then(res => {
          setWardList(res.data)
        })
    }
  }, [districtID, address.district])
  
  useEffect(() => {
    handleChange('address', address)   
  }, [address])

  const handleProvinceDropdown = (id, name) => {
    setProvinceID(id);
    setAddress({...address, province: name});
    setIsProvinceDropdown(false);
  }

  const handleDistrictDropdown = (id, name) => {
    setDistrictID(id);
    setAddress({...address, district: name});
    setIsDistrictDropdown(false);
  }

  const handleWardDropdown = (id, name) => {
    setAddress({...address, ward: name});
    setIsWardDropdown(false);
  }

  const handleAddress = (name, value) => {
    setAddress({...address, [name]: value});
  }

  return (
    <>
      <div className="view-list">
        <div className="view-list__wrapper">
          {
            order.products.map((product, index) => {
              if (index !== 0 && isViewList === false) return null
              return (
                <div key={index} className="order-item order-item--show">
                  <img src={product.image} alt={product.name} loading='lazy' className='item__img' />
                  <div className="item__info">
                    <p className="item__name">{product.name} - {product.color}</p>
                    <div className="item__price">
                      <div>
                        <div className="block-box-price">
                          <div className="box-info__box-price">
                            <p className="product__price--show">{formatPrice(product.new_price)}</p>
                            <p className="product__price--through">{formatPrice(product.old_price)}</p>
                          </div>
                        </div>
                      </div>
                      <p>
                        Số lượng:&nbsp;
                        <span className="text-danger">{product.quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        {
          order.products.length > 1 && 
          <div className="view-list__title">
            {
              !isViewList ?
              <button onClick={() => setIsViewList(true)}>
                {`và ${order.products.length - 1} sản phẩm khác`}
                <FontAwesomeIcon icon={faChevronDown} />
              </button> :
              <button onClick={() => setIsViewList(false)}>
                thu gọn
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
            }
          </div>
        }
      </div>
      <div className="block-customer">
        <p>Thông tin khách hàng</p>
        <div className="block-customer__wrapper">
          <div className="block-customer__main">
            <div className="customer-input__1">
              <p className="customer-name">{order.username}</p>
              <p className="customer-phone"></p>
            </div>
            <div className="customer-input__2">
              <div className="box-input">
                <input 
                  type="email"
                  name='email'
                  value={order.email} 
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  placeholder="Email" 
                  maxLength="100" 
                  autoComplete="off" 
                  className="box-input__main" 
                />
                <label>EMAIL</label>
                <div className="box-input__line"></div>
              </div>
              <span>(*) Hóa đơn VAT sẽ được gửi qua email này</span>
            </div>
          </div>
          <div className="block-customer__bottom"></div>
        </div>
      </div>
      <div className="block-payment">
        <p>Thông tin nhận hàng</p>
        <div className="block-payment__wrapper">
          <div className="block-payment__main">
            <div className="payment-main__shipping payment-main__item">
              <div className="customer-receiver">
                <div className="box-input">
                  <input 
                    type="text"
                    value={order.customer_name}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    name='customer_name'
                    placeholder='Họ tên người nhận' 
                    maxLength={1000} 
                    autoComplete='off' 
                    className="box-input__main" 
                  />
                  <label>TÊN NGƯỜI NHẬN</label>
                  <div className="box-input__line"></div>
                </div>
                <div className="box-input">
                  <input 
                    type="text"
                    value={order.phone}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    name='phone'
                    placeholder='Số điện thoại người nhận' 
                    maxLength={10} 
                    autoComplete='off' 
                    className="box-input__main" 
                  />
                  <label>SĐT NGƯỜI NHẬN</label>
                  <div className="box-input__line"></div>
                </div>
              </div>
              <div className="box-wrapper">
                <div className="box-select">
                  <div className="box-input">
                    <input 
                      type="search" 
                      value={address.province}
                      onClick={() => setIsProvinceDropdown(true)}
                      onChange={(e) => handleAddress(e.target.name, e.target.value)}
                      name="province" 
                      placeholder='Chọn tỉnh/thành phố' 
                      autoComplete='off' 
                      className="box-input__main" 
                    />
                    <label>TỈNH / THÀNH PHỐ</label>
                    <div className="box-input__line"></div>
                    <div className="box-input__arrow">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    {
                      isProvinceDropdown && 
                      <Dropdown 
                        title={'tỉnh/thành phố'} 
                        list={provinceList} 
                        handleDropdown={handleProvinceDropdown} 
                      />
                    }
                  </div>
                  <div className="box-input">
                    <input 
                      type="search" 
                      value={address.district}
                      onClick={() => setIsDistrictDropdown(true)}
                      onChange={(e) => handleAddress(e.target.name, e.target.value)}
                      name="district" 
                      placeholder='Chọn quận/huyện' 
                      autoComplete='off' 
                      className="box-input__main" 
                    />
                    <label>QUẬN / HUYỆN</label>
                    <div className="box-input__line"></div>
                    <div className="box-input__arrow">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    {
                      isDistrictDropdown && 
                      <Dropdown 
                        title={'quận/huyện'} 
                        list={districtList} 
                        handleDropdown={handleDistrictDropdown} 
                      />
                    }
                  </div>
                </div>
                <div className="box-select">
                  <div className="box-input">
                    <input 
                      type="search" 
                      value={address.ward}
                      onClick={() => setIsWardDropdown(true)}
                      onChange={(e) => handleAddress(e.target.name, e.target.value)}
                      name="ward" 
                      placeholder='Chọn phường/xã' 
                      autoComplete='off' 
                      className="box-input__main" 
                    />
                    <label>PHƯỜNG / XÃ</label>
                    <div className="box-input__line"></div>
                    <div className="box-input__arrow">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    {
                      isWardDropdown && 
                      <Dropdown 
                        title={'phường/xã'} 
                        list={wardList} 
                        handleDropdown={handleWardDropdown} 
                      />
                    }
                  </div>
                  <div className="box-input">
                    <input 
                      type="text" 
                      value={address.street}
                      onChange={(e) => handleAddress(e.target.name, e.target.value)}
                      name="street" 
                      placeholder='Số nhà, tên đường' 
                      maxLength={1000} 
                      autoComplete='off' 
                      className="box-input__main" 
                    />
                    <label>Địa chỉ</label>
                    <div className="box-input__line"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-note">
              <div className="box-input">
                <input 
                  type="text" 
                  value={order.note}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  name='note'
                  placeholder='Ghi chú khác (nếu có)' 
                  maxLength={255} 
                  autoComplete='off' 
                  className="box-input__main" 
                />
                <label>GHI CHÚ</label>
                <div className="box-input__line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentInfo