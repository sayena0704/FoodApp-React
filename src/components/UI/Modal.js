import classes from './Modal.module.css';
import { Fragment } from 'react';
// import  ReactDOM  from 'react'; 
// import ReactDOM from "react-dom/client" 
import { createPortal } from 'react-dom';
import React from 'react';

const Backdrop = props => {
    return <div className={classes.backdrop} onClick={props.onClose}></div>
}

const ModalOverlay = props => {
    return (
        <div className={classes.modal}>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
}

const portalElement = document.getElementById('overlays');

const Modal = props => {
    return <Fragment>
        {createPortal(<Backdrop onClose = {props.onClose}/>, portalElement)}
        {createPortal(
            <ModalOverlay>{props.children}</ModalOverlay>, portalElement
        )}
    </Fragment>
};

export default Modal;