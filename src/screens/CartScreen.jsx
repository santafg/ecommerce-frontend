import React, { useEffect } from "react";
import { useParams, useLocation, Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartActions";
import MessageBox from "../components/MessageBox";

const CartScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems, error } = cart;

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const checkoutHandler = () => {
    history.push("/signin?redirect=shipping");
  };
  return (
    <>
      <div className="row top">
        <div className="col-2">
          <h1>Shopping Cart</h1>
          {error && <MessageBox variant="danger">{error}</MessageBox>}
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is Empty . <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.product}>
                  <div className="row">
                    <div>
                      <img src={item.image} alt={item.name} className="small" />
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
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>${item.price}</div>
                    <div onClick={() => removeFromCartHandler(item.product)}>
                      <button>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>
                  Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items) :
                  $ {cartItems.reduce((a, c) => a + c.qty * c.price, 0)}
                </h2>
              </li>
              <li>
                <button
                  className="primary"
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartScreen;
