import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

import './CSS/Product.css'
import MenuBottomTabs from '../Components/MenuBottomTabs/MenuBottomTabs';

function Product() {
  const {allProducts} = useContext(ShopContext);
  const {productId} = useParams();
  const product = allProducts.find((item) => item.id === Number(productId));

  return (
    <div className='product-container'>
      {
        (product) ? 
        <>
          <Breadcrumbs product={product} category={product.category} />
          <ProductDisplay product={product} />
          <DescriptionBox product={product} />
          <RelatedProducts category={product.category} />
        </> : 
        <></>
      }
      <MenuBottomTabs active={'Home'} />
    </div>
  )
}

export default Product