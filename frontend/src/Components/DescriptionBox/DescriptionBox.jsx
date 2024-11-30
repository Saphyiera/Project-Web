import React, { useEffect, useState } from 'react'
import './DescriptionBox.css'

function DescriptionBox({ product }) {
    const [description, setDescription] = useState([]);

    useEffect(() => {
        setDescription(product.description.split('\n'));
    }, [])

  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-nav">
            <div className="descriptionbox-nav-box">Mô tả sản phẩm</div>
            <div className="descriptionbox-nav-box fade">Thông số kỹ thuật</div>
        </div>
        <div className="descriptionbox-description">
            {description.map((element, index) => 
                <p key={index}>{element}</p>
            )}
        </div>
    </div>
  )
}

export default DescriptionBox