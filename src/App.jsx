import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import SellerRoute from "./components/SellerRoute";
import { signout } from "./redux/userActions";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import OrderScreen from "./screens/OrderScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProuductScreen from "./screens/ProuductScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SigninScreen from "./screens/SigninScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import SellerScreen from "./screens/SellerScreen";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import { listProductCategories } from "./redux/productActions";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";

const App = () => {
  const cart = useSelector((state) => state.cart);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const { cartItems } = cart;

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <div className="grid-container">
          <header className="row">
            <div>
              <button
                type="button"
                className="open-sidebar"
                onClick={() => setSidebarIsOpen(true)}
              >
                <i className="fa fa-bars"></i>
              </button>
              <Link className="brand" to="/">
                Ecommerce
              </Link>
            </div>
            <div>
              <Route
                render={({ history }) => (
                  <SearchBox history={history}></SearchBox>
                )}
              ></Route>
            </div>
            <div>
              <Link className="white" to="/cart">
                Cart
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </Link>
              {userInfo ? (
                <div className="dropdown">
                  <Link className="white" to="#">
                    {userInfo.name} <i className="fa fa-caret-down"></i>{" "}
                  </Link>
                  <ul className="dropdown-content at-top">
                    <li>
                      <Link className="white" to="/profile">
                        User
                      </Link>
                    </li>
                    <li>
                      <Link className="white" to="/orderhistory">
                        Order History
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="white"
                        onClick={signoutHandler}
                        to="#signout"
                      >
                        Sign Out
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link className="white" to="/signin">
                  Sign In
                </Link>
              )}
              {userInfo && userInfo.isSeller && (
                <div className="dropdown">
                  <Link className="white" to="#admin">
                    Seller <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content at-top">
                    <li>
                      <Link className="white" to="/productlist/seller">
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link className="white" to="/orderlist/seller">
                        Orders
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              {userInfo && userInfo.isAdmin && (
                <div className="dropdown">
                  <Link className="white" to="#admin">
                    Admin <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content at-top">
                    <li>
                      <Link className="white" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="white" to="/productlist">
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link className="white" to="/orderlist">
                        Oders
                      </Link>
                    </li>
                    <li>
                      <Link className="white" to="/userlist">
                        Users
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </header>
          <aside className={sidebarIsOpen ? "open" : ""}>
            <ul className="categories">
              <li>
                <strong>Categories</strong>
                <button
                  onClick={() => setSidebarIsOpen(false)}
                  className="close-sidebar"
                  type="button"
                >
                  X
                </button>
              </li>
              {loadingCategories ? (
                <LoadingBox></LoadingBox>
              ) : errorCategories ? (
                <MessageBox variant="danger">{errorCategories}</MessageBox>
              ) : (
                categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={`/search/category/${c}`}
                      onClick={() => setSidebarIsOpen(false)}
                    >
                      {c}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </aside>
          <main>
            <Route path="/seller/:id" component={SellerScreen}></Route>
            <Route exact path="/">
              <HomeScreen />
            </Route>
            <Route
              path="/search/name/:name?"
              component={SearchScreen}
              exact
            ></Route>
            <Route
              path="/search/category/:category"
              component={SearchScreen}
              exact
            ></Route>
            <Route
              path="/search/category/:category/name/:name"
              component={SearchScreen}
              exact
            ></Route>
            <Route
              path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
              component={SearchScreen}
              exact
            ></Route>
            <Route path="/signin">
              <SigninScreen />
            </Route>
            <Route path="/register">
              <RegisterScreen />
            </Route>
            <PrivateRoute
              path="/profile"
              component={ProfileScreen}
            ></PrivateRoute>
            <AdminRoute
              exact
              path="/productlist"
              component={ProductListScreen}
            ></AdminRoute>
            <AdminRoute
              path="/productlist/pageNumber/:pageNumber"
              component={ProductListScreen}
              exact
            ></AdminRoute>
            <AdminRoute
              exact
              path="/orderlist"
              component={OrderListScreen}
            ></AdminRoute>
            <SellerRoute
              path="/productlist/seller"
              component={ProductListScreen}
            ></SellerRoute>
            <SellerRoute
              path="/orderlist/seller"
              component={OrderListScreen}
            ></SellerRoute>
            <AdminRoute
              path="/userlist"
              component={UserListScreen}
            ></AdminRoute>
            <AdminRoute
              path="/user/:id/edit"
              component={UserEditScreen}
            ></AdminRoute>
            <Route path="/shipping">
              <ShippingAddressScreen />
            </Route>
            <Route path="/payment">
              <PaymentMethodScreen />
            </Route>
            <Route path="/placeorder">
              <PlaceOrderScreen />
            </Route>
            <Route path="/order/:id">
              <OrderScreen />
            </Route>
            <Route path="/orderhistory">
              <OrderHistoryScreen />
            </Route>
            <Route path="/cart/:id?">
              <CartScreen />
            </Route>
            <Route exact path="/product/:id">
              <ProuductScreen />
            </Route>
            <Route exact path="/product/:id/edit">
              <ProductEditScreen />
            </Route>
          </main>

          <footer className="row center">All right reserved</footer>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
