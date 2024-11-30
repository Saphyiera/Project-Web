import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './CartItems.css'
import remove_icon from '../Assets/cart_cross_icon.png'
import { ShopContext } from '../../Context/ShopContext'

function CartItems() {
    const {cartItems, orderProducts, formatPrice,
        addToCart, removeFromCart, deleteFromCart,
        addToOrder, removeFromOrder, isProductInOrder, getTotalCost
    } = useContext(ShopContext)

    const handleAllProducts = () => {
        if (orderProducts.length === cartItems.length)
            removeFromOrder(cartItems);
        else 
            addToOrder(cartItems);
    }

    const handleProduct = (product) => {
        if (isProductInOrder(product)) {
            removeFromOrder(product);
        }
        else {
            addToOrder(product);
        }
    }

  return (
    <div className='cartitems'>
        <div className="header-action">
            <div className="select-all-products-action">
                <div className="custom-control">
                    <input 
                        type="checkbox" 
                        className='custom-control-input' 
                        value="true" 
                        id="__checkbox__all"
                        checked={cartItems.length !== 0 && orderProducts.length === cartItems.length}
                        onChange={() => handleAllProducts()}
                    />
                    <label htmlFor="__checkbox__all" className="custom-control-label"></label>
                </div>
                <p>Chọn tất cả</p>
            </div>
            <button 
                className="btn-remove-checked"
                onClick={() => removeFromOrder(cartItems)}
                style={orderProducts.length === 0 ? {display: 'none'} : {}}
            >
                <em>Xoá các sản phẩm đã chọn</em>
            </button>
        </div>
        <hr />
        <div className="cartitems-format-main">
            <div></div>
            <div><p>Sản phẩm</p></div>
            <p>Tên sản phẩm</p>
            <div><p>Giá</p></div>
            <div><p>Số lượng</p></div>
            <div><p>Tổng tiền</p></div>
            <div><p>Xoá</p></div>
        </div>
        <hr />
        {
            cartItems.map((product, index) => {
                return (
                    <div key={index}>
                        <div className="cartitems-format-main cartitem-format">
                            <input 
                                type="checkbox" 
                                className='custom-control-input' 
                                value={true} 
                                id={`__checkbox__${index}`}
                                checked={isProductInOrder(product) ? true : false}
                                onChange={() => handleProduct(product)} 
                            />
                            <label className='custom-control-label' htmlFor={`__checkbox__${index}`}>
                                <img src={product.image} alt={product.name} className='cartitem-product-icon' />
                            </label>
                            <p>{product.name} - {product.color}</p>
                            <div><p>{formatPrice(product.new_price)}</p></div>
                            <div className='cartitem-quantity-action'>
                                <span 
                                    className="minus"
                                    onClick={() => removeFromCart(product.productId, product.color)}
                                >
                                    -
                                </span>
                                <input type="text" className='cartitem-quantity' readOnly value={product.quantity} />
                                <span 
                                    className="plus"
                                    onClick={() => addToCart(
                                        product.productId,
                                        product.name, 
                                        product.color,
                                        product.image,
                                        product.new_price,
                                        product.pld_price
                                    )}
                                >
                                    +
                                </span>
                            </div>
                            <div><p>{formatPrice(product.new_price * product.quantity)}</p></div>
                            <img className='cartitem-delete-icon' src={remove_icon} onClick={() => deleteFromCart(product.productId, product.color)} alt="" />
                        </div>
                        <hr />
                    </div>
                )
            })
        }
        <div className="cartitems-down">
            <div className="cartitems-total">
                <h1>Tổng tiền</h1>
                <div>
                    <div className="cartitems-total-item">
                        <p>Tổng tiền hàng</p>
                        <p>{formatPrice(getTotalCost())}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Tổng tiền phí vận chuyển</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <h3>Tổng thanh toán</h3>
                        <h3>{formatPrice(getTotalCost())}</h3>
                    </div>
                </div>
                <Link to='/pay'>
                    <button>
                        ĐẶT HÀNG
                    </button>
                </Link>
            </div>
            <div className="cartitems-promocode">
                <p>If you have a promo code, enter it here</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder='Promo code' />
                    <button>Submit</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItems