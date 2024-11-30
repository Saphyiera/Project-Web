import React, { useContext } from 'react'

import './ModalViewList.css'
import { ShopContext } from '../../Context/ShopContext'

function ModalViewList({ products, closeViewList }) {
  const { formatPrice } = useContext(ShopContext);

  return (
    <div id='modalViewListItemInQuote_modal-outer'>
        <div
          id='modalViewListItemInQuote'
          role='dialog'
          aria-labelledby='modalViewListItemInQuote_modal-title'
          aria-describedby='modalViewListItemInQuote_modal-body'
          className="modal"
          aria-modal="true"
        >
          <div className="modal-dialog">
            <span tabIndex={0}></span>
            <div id="modalViewListItemInQuote_modal-content" tabIndex={-1} className="modal-content">
              <header id="modalViewListItemInQuote_modal-header" className="modal-header">
                <h5 id="modalViewListItemInQuote_modal-title" className="modal-title">
                  Danh sách sản phẩm đang thanh toán
                </h5>
                <button type="button" onClick={closeViewList} aria-label="Close" className="close">×</button>
              </header>
              <div id="modalViewListItemInQuote_modal-body" className="modal-body">
                {
                  products.map((product, index) => {
                    return (
                      <div key={index} className="product-item">
                        <img src={product.image} alt={product.name} loading='lazy' className='product-img' />
                        <div className="product-info">
                          <p>{product.name} - {product.color}</p>
                          <div className="product-price-qty">
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
            </div>
            <span tabIndex={0}></span>
          </div>
        </div>
        <div id="modalViewListItemInQuote_modal-backdrop" className="modal-backdrop"></div>
    </div>
  )
}

export default ModalViewList