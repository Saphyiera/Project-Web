import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../Context/ShopContext';

import './ProductDisplay.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faChevronLeft, faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function ProductDisplay(props) {
    const {product} = props;
    const { formatPrice, addToCart } = useContext(ShopContext);
    const [index, setIndex] = useState(0);
    let slideLength = product.images.length + product.colors.length;
    const [choosenColor, setChoosenColor] = useState(0);

    useEffect(() => {
        let minPriceColor = 0;
        product.colors.forEach((item, index) => {
            if (product.colors[minPriceColor].new_price > item.new_price)
                minPriceColor = index;
        })
        setChoosenColor(minPriceColor);
    }, [product])

  return (
    <div className='productdisplay'>
        <div className="box-product-detail">
            <div className="box-product-detail__left">
                <div className="box-gallery">
                    <div className="gallery-slide swiper-container">
                        <div 
                            className="swiper-wrapper"
                            style={{
                                transform: `translateX(${-index * 100}%)`,
                                transitionDuration: '300ms'
                            }}
                        >
                            {product.images.map((image, index) => {
                                return (
                                    <div key={index} className="swiper-slide gallery-img">
                                        <img src={image} alt="" />
                                    </div>
                                )
                            })}
                            {product.colors.map((item, index) => {
                                return (
                                    <div key={index} className="swiper-slide gallery-img">
                                        <img src={item.image} alt="" />
                                    </div>
                                )
                            })}
                        </div>
                        <div 
                            className="swiper-button-prev"
                            onClick={() => setIndex(prev => prev - 1)}
                            style={ (index === 0) ? {display: 'none'} : {} }
                        >
                            <div className="icon">
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </div>
                        </div>
                        <div 
                            className="swiper-button-next"
                            onClick={() => setIndex(prev => prev + 1)}
                            style={ (index === slideLength - 1) ? {display: 'none'} : {} }
                        >
                            <div className="icon">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>
                    </div>
                    <div className="thumbnail-slide swiper-container">
                        <div className="swiper-wrapper">
                            {
                                product.images.map((image, i) => {
                                    return (
                                        <div 
                                            key={i} 
                                            className={`swiper-slide thumb-img ${index === i ? 'swiper-slide-thumb-active' : ''}`}
                                            onClick={() => setIndex(i)}
                                        >
                                            <img src={image} width={'58'} height={'58'} alt="" />
                                        </div>
                                    )
                                })
                            }
                            {
                                product.colors.map((item, i) => {
                                    return (
                                        <div 
                                            key={i} 
                                            className={`swiper-slide thumb-img ${index === product.images.length + i && 'swiper-slide-thumb-active'}`}
                                            onClick={() => setIndex(product.images.length + i)}
                                        >
                                            <img src={item.image} width={'58'} height={'58'} alt="" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="box-product-detail__right">
                <div className="box-header">
                    <div className="box-product-name">
                        <h1>{product.name}</h1>
                    </div>
                    <div className="box-rating">
                        <div className="star-icon">
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                        <div className="star-icon">
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                        <div className="star-icon">
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                        <div className="star-icon">
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                        <div className="star-icon">
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                        &nbsp;100 đánh giá
                    </div>
                </div>
                <hr />
                <div className="box-product-colors">
                    <div className="box-title">
                        <p>Chọn màu để xem giá chi tiết</p>
                    </div>
                    <div className="box-content">
                        <ul className="list-colors">
                            {
                                product.colors.map((item, index) => (
                                    <li 
                                        key={index} 
                                        className={
                                            `item-color ${choosenColor === index && 'choosen-color'}`
                                        }
                                        onClick={() => {
                                            setIndex(product.images.length + index);
                                            setChoosenColor(index);
                                        }}
                                    >
                                        <a title={item.color} className="change-color-btn">
                                            <img src={item.image} alt={product.name} />
                                            <div>
                                                <strong className="item-color-name">{item.color}</strong>
                                                <span>{formatPrice(item.new_price)}</span>
                                            </div>
                                        </a>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="box-price">
                    <div className="item-price-detail">
                        <p className="item-new-price">{formatPrice(product.colors[choosenColor].new_price)}</p>
                    </div>
                    <div className="item-price-detail">
                        <p className="item-old-price">{formatPrice(product.colors[choosenColor].old_price)}</p>
                    </div>
                </div>
                <div className="box-order-btn">
                    <button 
                        onClick={() => addToCart(
                            product.id, 
                            product.name,
                            product.colors[choosenColor].color, 
                            product.colors[choosenColor].image, 
                            product.colors[choosenColor].new_price,
                            product.colors[choosenColor].old_price
                        )} 
                        className="order-btn"
                    >
                        <Link to='/cart'>
                            <strong>MUA NGAY</strong>
                            <span>(Thanh toán khi nhận hàng hoặc nhận tại cửa hàng)</span>
                        </Link>
                    </button>
                    <button 
                        onClick={() => addToCart(
                            product.id,
                            product.name,
                            product.colors[choosenColor].color, 
                            product.colors[choosenColor].image, 
                            product.colors[choosenColor].new_price,
                            product.colors[choosenColor].old_price
                        )} 
                        className="add-to-cart-btn"
                    >
                        <FontAwesomeIcon icon={faCartPlus} />
                        <span>Thêm vào giỏ</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductDisplay