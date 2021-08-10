import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link, useParams } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { deliverOrder, detailsOrder } from "../redux/orderActions";
import { PayPalButton } from "react-paypal-button-v2";
import Axios from "axios";
import { ORDER_DELIVER_RESET } from "../redux/orderConstants";
const OrderScreen = () => {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;

  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get("https://ecomb.herokuapp.com/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (
      !order ||
      // successPay ||
      successDeliver ||
      (order && order._id !== id)
    ) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(id));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, sdkReady, id, successDeliver, order]);

  const successPaymentHandler = () => {};
  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <>
      <div>
        <h1>Order : {order._id}</h1>
        <div className="row top">
          <div className="col-2">
            <ul>
              <li>
                <div className="card card-body">
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name:</strong> {order.shippingAddress.fullName}{" "}
                    <br />
                    <strong>Address:</strong> {order.shippingAddress.address} ,{" "}
                    {order.shippingAddress.city} ,{" "}
                    {order.shippingAddress.postalCode} ,{" "}
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <MessageBox variant="success">
                      Delivered at {order.deliveredAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Delivered </MessageBox>
                  )}
                </div>
              </li>
              <li>
                <div className="card card-body">
                  <h2>Payment</h2>
                  <p>
                    <strong>Method:</strong> {order.paymentMethod} <br />
                  </p>
                  {order.isPaid ? (
                    <MessageBox variant="success">
                      Paid 
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Paid </MessageBox>
                  )}
                </div>
              </li>
              <li>
                <div className="card card-body">
                  <h2>Order Items</h2>
                  <ul>
                    {order.orderItems.map((item) => (
                      <li key={item.product}>
                        <div className="row">
                          <div>
                            <img
                              src={`https://ecomb.herokuapp.com${item.image}`}
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
                    <div>${order.itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Shipping</div>
                    <div>${order.shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Tax</div>
                    <div>${order.taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>
                      <strong>Total</strong>{" "}
                    </div>
                    <div>
                      {" "}
                      <strong> ${order.totalPrice}</strong>
                    </div>
                  </div>
                </li>
                {!order.isPaid && (
                  <li>
                    {!sdkReady ? (
                      <LoadingBox></LoadingBox>
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    )}
                  </li>
                )}
                {userInfo.isAdmin && !order.isDelivered && (
                  <li>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    {errorDeliver && (
                      <MessageBox variant="danger">{errorDeliver}</MessageBox>
                    )}
                    <button
                      type="button"
                      className="primary block"
                      onClick={deliverHandler}
                    >
                      Deliver Order
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
