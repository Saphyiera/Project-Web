import React, { useState } from 'react'

import './PaymentModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { payment } from '../Assets/payment.js'
import tickIcon from '../Assets/download.svg'

function PaymentModal({ modal, handlePopup, handlePayment }) {
    const [paymentModal, setPaymentModal] = useState(modal);

    const handelSubmit = () => {
        handlePayment(paymentModal);
        handlePopup();
    }

  return (
    <>
        <div className="payment-overlay"></div>
        <div className="payment-modal">
            <div className="payment-modal__head">
                <p>Chọn phương thức thanh toán</p>
                <em onClick={() => handlePopup()}>
                    <FontAwesomeIcon icon={faXmark} />
                </em>
            </div>
            <div className="payment-modal__body">
                <div className="payment-modal__body-main">
                    <div className="list-payment">
                        <p>Khả dụng</p>
                        {
                            payment.map((payModal, index) => {
                                return (
                                    <div key={index} onClick={() => setPaymentModal(payModal.name)} 
                                        className={`list-payment__item ${paymentModal === payModal.name ? "list-payment__item--active" : ''}`}
                                    >
                                        <div className="payment-item__img">
                                            <img src={payModal.image} alt="" />
                                        </div>
                                        <div className="payment-item__title">
                                            <p>{payModal.name}</p>
                                        </div>
                                        <div className="payment-item__tick">
                                            <img src={tickIcon} alt="" />
                                        </div> 
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="payment-modal__bottom">
                <button onClick={() => handelSubmit()} disabled={`${paymentModal === "" ? "disabled" : ""}`} className="btn btn-danger">
                    Xác nhận
                </button>
            </div>
        </div>
    </>
  )
}

export default PaymentModal