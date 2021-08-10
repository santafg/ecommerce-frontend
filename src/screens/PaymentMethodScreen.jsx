import React, { useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { savePaymentMethod } from "../redux/cartActions";

const PaymentMethodScreen = () => {
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const userSignin = useSelector((state) => state.userSignin); 
  const {userInfo} = userSignin;
  const { shippingAddress } = cart;
  if (!userInfo || !shippingAddress.address) {
    history.push("/shipping");
  }
  const [paymentMethod, setpaymentMethod] = useState("Paypal");
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };
  return (
    <>
      <div>
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
        <form onSubmit={submitHandler} className="form">
          <div>
            <h1>Payment Method</h1>
          </div>
          <div>
            <div>
              <input
                type="radio"
                id="paypal"
                value="PayPal"
                name="paymentMethod"
                required
                checked
                onChange={(e) => setpaymentMethod(e.target.value)}
              />
              <label htmlFor="paypal">Paypal</label>
            </div>
          </div>
          <div>
            <div>
              <input
                type="radio"
                id="cod"
                value="COD"
                name="paymentMethod"
                required
                onChange={(e) => setpaymentMethod(e.target.value)}
              />
              <label htmlFor="cod">COD</label>
            </div>
          </div>
          <div>
            <button className="primary" type="submit">
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentMethodScreen;
