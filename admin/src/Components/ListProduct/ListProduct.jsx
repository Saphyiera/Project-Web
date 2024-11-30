import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import './ListProduct.css'

import crossIcon from '../../assets/cross_icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'

function ListProduct() {
    const [allProducts, setAllProducts] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/product/all')
            .then((res) => res.json())
            .then((data) => {
                setAllProducts(data);
            });
    };
    
    useEffect(() => {
        fetchInfo();
    }, []);

    const formatPrice = (price) => {
        let priceString = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        return priceString.replace(/\s/g, '');
    }

    const removeProduct = async (id) => {
        await fetch('http://localhost:4000/product/remove', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
        });
        await fetchInfo();
    }
    
  return (
    <div className='listproduct'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
            <p>Hình ảnh</p>
            <p>Tên sản phẩm</p>
            <div><p>Giá sản phẩm</p></div>  
            <div><p>Giá khuyến mãi</p></div>
            <div><p>Category</p></div>
            <div><p>Thời gian</p></div>
            <div><p>Số lượng</p></div>
            <div><p>Đã bán</p></div>
            <div><p>Chỉnh sửa</p></div>
            <div><p>Xoá</p></div>
        </div>
        <div className="listproduct-allproducts">
            <hr />
            {allProducts.map((product, index) => {
                return (
                    <div key={index}>
                        <div className="listproduct-format-main listproduct-format">
                            {(product.images) ? <img src={product.images[0]} alt="" className="listproduct-product-icon" /> : <img src={product.image} alt="" className="listproduct-product-icon" />}
                            <p>{product.name}</p>
                            <div><p>{formatPrice(product.old_price)}</p></div>
                            <div><p>{formatPrice(product.new_price)}</p></div>
                            <div><p>{product.category}</p></div>
                            <div><p>{product.date}</p></div>
                            <div><p>{product.total_quantity}</p></div>
                            <div><p>{product.total_sold}</p></div>
                            <Link to={`/edit/${product.id}`}><div><FontAwesomeIcon icon={faPenToSquare} className='listproduct-edit-icon' /></div></Link>
                            <div><img onClick={() => removeProduct(product.id)} src={crossIcon} alt="" className="listproduct-remove-icon" /></div>
                        </div>
                        <hr />
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ListProduct