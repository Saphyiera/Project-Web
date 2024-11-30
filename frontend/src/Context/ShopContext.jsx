import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

function ShopContextProvider(props) {
    const [allProducts, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [orderProducts, setOrderProducts] = useState([]);

    const fetchData = async () => {
        await axios.get('http://localhost:4000/product/all')
            .then((res) => setAllProducts(res.data));

        if (localStorage.getItem('auth-token')) {
            axios.get('http://localhost:4000/cart/get', {
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => setCartItems(res.data));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const formatPrice = (price) => {
        let priceString = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        return priceString.replace(/\s/g, '');
    }
    
    const addToCart = (productId, name, color, image, new_price, old_price) => {
        let found = false;
        let index = 0;
        let newCartItems = [...cartItems]
        cartItems.forEach((product, i) => {
            if (product && product.productId === productId && product.color === color) {
                found = true;
                index = i;
            }
        })
        if (found) {
            newCartItems[index].quantity += 1;
            if (isProductInOrder({productId, color})) {
                let quantity = newCartItems[index].quantity;
                addToOrder({productId, color, quantity});
            }
        }
        else {
            newCartItems = [
                ...newCartItems,
                {
                    productId: productId,
                    name: name,
                    color: color,
                    image: image,
                    new_price: new_price,
                    old_price: old_price,
                    quantity: 1
                }
            ]
        }
        setCartItems(newCartItems)

        if (localStorage.getItem('auth-token')) {
            axios.post('http://localhost:4000/cart/addToCart', {
                "productId": productId,
                "color": color,
                "image": image,
                "new_price": new_price,
                "old_price": old_price
            }, {
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => console.log(res.data));
        }
    }
    
    const removeFromCart = (productId, color) => {
        let found = false;
        let index = 0;
        let newCartItems = [...cartItems]
        cartItems.forEach((product, i) => {
            if (product && product.productId === productId && product.color === color) {
                found = true;
                index = i;
            }
        })
        if (found) {
            if (newCartItems[index].quantity > 0) {
                newCartItems[index].quantity -= 1;
                if (isProductInOrder({productId, color})) {
                    let quantity = newCartItems[index].quantity;
                    addToOrder({productId, color, quantity});
                }
            }
            if (newCartItems[index].quantity === 0) {
                removeFromOrder({productId, color});
                newCartItems.splice(index, 1);
            }
        }
        setCartItems(newCartItems);

        if (localStorage.getItem('auth-token')) {
            axios.post('http://localhost:4000/cart/removeFromCart', {
                "productId": productId,
                "color": color
            }, {
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                }                
            })
            .then((res) => console.log(res.data));
        }
    }

    const deleteFromCart = (productId, color) => {
        let found = false;
        let index = 0;
        let newCartItems = [...cartItems]
        cartItems.forEach((product, i) => {
            if (product && product.productId === productId && product.color === color) {
                found = true;
                index = i;
            }
        })
        if (found) {
            removeFromOrder({productId, color});
            newCartItems.splice(index, 1);
        }
        setCartItems(newCartItems);

        if (localStorage.getItem('auth-token')) {
            axios.delete('http://localhost:4000/cart/deleteFromCart', {
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    "productId": productId,
                    "color": color
                }
            })
            .then((res) => console.log(res.data));
        }
    }
    
    const getTotalItems = () => {
        let totalItems = 0;
        cartItems.forEach((product) => {
            totalItems += Number(product.quantity);
        })
        return totalItems;
    }

    const addToOrder = (product) => {
        if (product instanceof Array) {
            setOrderProducts([...product]);
        } else {
            const foundProduct = isProductInOrder(product);
            if (foundProduct) {
                foundProduct.quantity = product.quantity;
            } else {
                setOrderProducts(prev => [...prev, product]);
            }
        }
    }

    const removeFromOrder = (product) => {
        if (product instanceof Array) {
            setOrderProducts([]);
        } else {
            const index = orderProducts.findIndex(item => item.productId === product.productId && item.color === product.color)
            if (index !== -1) {
                setOrderProducts(prev => {
                    prev.splice(index, 1);
                    return [...prev];
                });
            }
        }
    }

    const isProductInOrder = (product) => {
        return orderProducts.find(item => item.productId === product.productId && item.color === product.color);
    }

    const getTotalOrderItems = () => {
        let totalItems = 0;
        orderProducts.forEach((product) => {
            totalItems += Number(product.quantity);
        })
        return totalItems;
    }

    const getTotalCost = () => {
        let totalCost = 0;
        orderProducts.forEach((product) => {
            totalCost += product.new_price * product.quantity
        })
        return totalCost;
    }
    
    const contextValue = {
        allProducts, cartItems, orderProducts, formatPrice,
        addToCart, removeFromCart, deleteFromCart, getTotalItems, 
        addToOrder, removeFromOrder, isProductInOrder, getTotalOrderItems, getTotalCost
    };
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;