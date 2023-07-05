import React, { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = props =>{
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length >0;

    const carItemRemoveHandler = id =>{
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = item =>{
        cartCtx.addItem({...item,amount: 1})
    };

    const orderHandler = () =>{
        setIsCheckout(true);
    }

    const submitOrderHandler  = async (userdata) =>{
        setIsSubmitting(true);
       await fetch('https://react-http-268e0-default-rtdb.firebaseio.com/orders.json',{
        method: 'POST',
        body: JSON.stringify({
            user: userdata,
            orderedItems: cartCtx.items
        })
      });
      setIsSubmitting(false);
      setDidSubmit(true);
      cartCtx.clearCart();
    };

    const cartitems = (
    <ul className={classes['cart-items']}> 
    {cartCtx.items.map((item) => <CartItem 
    key = {item.id} 
    name={item.name}
    amount ={item.amount}
    price = {item.price}
    onRemove={carItemRemoveHandler.bind(null, item.id)}
    onAdd={cartItemAddHandler.bind(null, item)}
    />
    )}
    </ul>);

    const modalActions = (
    <div className={classes.actions}>
    <button className={['button--alt']} onClick ={props.onClose}>Close</button>
    {hasItems && (
       <button className={classes.button} onClick={orderHandler}>
        Order
        </button>
    )}
    </div>
    );

    const cartModalContent = <React.Fragment>{cartitems}
    <div className={classes.total}> 
        <span>Total Amount</span>
        <span>{totalAmount}</span>
    </div>
    {isCheckout && <Checkout onConfirm ={submitOrderHandler} 
    onCancel ={props.onClose}/>}
    {!isCheckout && modalActions}
    </React.Fragment>

    const isSubmittingModalContent = <p>Sending order data....</p>
    const didSubmitModalContent = (
       <React.Fragment>
        <p>Successfuly sent the order!</p>
        <div className={classes.actions}>
    <button className={classes.button} onClick ={props.onClose}>Close</button>
    </div>
        </React.Fragment>
    );

    return(
    <Modal onClose = {props.onClose}>
        {!isSubmitting && !didSubmit && cartModalContent}
        {isSubmitting && isSubmittingModalContent}
        {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
    );
};

export default Cart;