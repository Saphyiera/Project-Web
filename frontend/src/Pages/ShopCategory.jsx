import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import { ShopContext } from '../Context/ShopContext';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Item from '../Components/Item/Item';
import MenuBottomTabs from '../Components/MenuBottomTabs/MenuBottomTabs';

import './CSS/ShopCategory.css'

import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import axios from 'axios';

function ShopCategory(props) {
  const {allProducts} = useContext(ShopContext);
  const {brandName} = useParams();
  const [brandList, setBrandList] = useState([]);
  const [maxIndex, setMaxIndex] = useState(20);

  let productBrand =''
  let products = allProducts;

  if (brandName) {
    products = allProducts.filter((item) => {
      if (item.category === props.category && item.brand.toLowerCase() === brandName) {
        productBrand = item.brand;
        return true;
      }
      return false;
    })
  }

  useEffect(() => {
    axios.get(`http://localhost:4000/brand/${props.category}`)
    .then((res) => setBrandList(res.data));
  }, [props.category])

  return (
    <div className='category-container'>
      <Breadcrumbs category={props.category} brand={productBrand} />
      <div className="block-filter-brand">
        <div className="filter-brands-title">Chọn theo thương hiệu</div>
        <div className="list-brand">
          {
            brandList ?
            brandList.map((brand, index) => {
              return (
                <Link
                  key={index}
                  to={`/${props.category.toLowerCase()}/${brand.name.toLowerCase()}`}
                  className='list-brand-item'
                >
                  <img src={brand.image} alt={brand.name} className="brand-img" />
                </Link>
              )
            }) : <></>
          }
        </div>
      </div>
      <div className="block-filter-indexSort">
        <div className="filter-indexSort-title">
          <p>
            <span>Hiển thị 1-{(maxIndex < products.length) ? maxIndex : products.length}</span> trên tổng số {products.length} sản phẩm
          </p>
          <div className="filter-sort-btn">
            Sắp xếp theo <img src={dropdown_icon} alt="" />
          </div>
        </div>
        <div className="block-products-filter">
          {products.slice(0, Math.min(maxIndex, products.length)).map((product, index) => {
            return (
              <Item 
                key={index}
                id={product.id}
                name={product.name}
                image={product.images[0]}
                new_price={product.new_price}
                old_price={product.old_price}
              />
            )
          })}
        </div>
        {(maxIndex < products.length) && 
        <div onClick={() => setMaxIndex(prev => prev + 20)} className="category-loadmore">
          Xem thêm {products.length - maxIndex} sản phẩm
        </div>
        }
      </div>
      <MenuBottomTabs active={'Home'} />
    </div>
  )
}

export default ShopCategory;