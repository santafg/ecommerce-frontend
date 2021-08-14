import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../redux/orderActions";
import { ORDER_CREATE_RESET } from "../redux/orderConstants";
import MessageBox from '../components/MessageBox'
import LoadingBox from '../components/LoadingBox'
const PlaceOrderScreen = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const history = useHistory();
  if (!cart.paymentMethod) {
    history.push("/payment");
  }
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;

  //   order price calculations
  const toPrice = (num) => Number(num.toFixed(2)); // 5.4341 = 5.43
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  cart.taxPrice = toPrice(cart.itemsPrice * 0.15);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const PlaceOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
  };

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success]);

  return (
    <>
      <div>
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        <div className="row top">
          <div className="col-2">
            <ul>
              <li>
                <div className="card card-body">
                  <h2>Shopping</h2>
                  <p>
                    <strong>Name:</strong> {cart.shippingAddress.fullName}{" "}
                    <br />
                    <strong>Address:</strong> {cart.shippingAddress.address} ,{" "}
                    {cart.shippingAddress.city} ,{" "}
                    {cart.shippingAddress.postalCode} ,{" "}
                    {cart.shippingAddress.country}
                  </p>
                </div>
              </li>
              <li>
                <div className="card card-body">
                  <h2>Payment</h2>
                  <p>
                    <strong>Method:</strong> {cart.paymentMethod} <br />
                  </p>
                </div>
              </li>
              <li>
                <div className="card card-body">
                  <h2>Order Items</h2>
                  <ul>
                    {cart.cartItems.map((item) => (
                      <li key={item.product}>
                        <div className="row">
                          <div>
                            <img
                              src={
                                item.image.indexOf("/res.cloudinary.com") >= 0
                                  ? item.image
                                  : `https://ecomb.herokuapp.com${item.image}`
                              }
                              alt={item.name}
                              className="small"
                            />
                          </div>

                          <div className="min-30">
                            <Link
                              style={{ color: "black" }}
                              to={`/product/${item.product}`}
                            >
                              {item.name}
                            </Link>
                          </div>
                          <div>
                            {item.qty} x ${item.price} = $
                            {item.qty * item.price}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-1">
            <div className="card card-body">
              <ul>
                <li>
                  <h2>Order Summary</h2>
                </li>
                <li>
                  <div className="row">
                    <div>Items</div>
                    <div>${cart.itemsPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Shipping</div>
                    <div>${cart.shippingPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Tax</div>
                    <div>${cart.taxPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>
                      <strong>Total</strong>{" "}
                    </div>
                    <div>
                      {" "}
                      <strong> ${cart.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </li>
                <li>
                  <button
                    className="primary block"
                    disabled={cart.cartItems === 0}
                    onClick={PlaceOrderHandler}
                  >
                    Place Order
                  </button>
                </li>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger" >{error}</MessageBox>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
