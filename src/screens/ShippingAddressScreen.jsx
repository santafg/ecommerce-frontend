import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../redux/cartActions";

const ShippingAddressScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const {shippingAddress} =cart ;
  if (!userInfo) {
    history.push("/signin");
  }

  const [fullName, setfullName] = useState(shippingAddress.fullName);
  const [address, setaddress] = useState(shippingAddress.address);
  const [city, setcity] = useState(shippingAddress.city);
  const [postalCode, setpostalCode] = useState(shippingAddress.postalCode);
  const [country, setcountry] = useState(shippingAddress.country);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ fullName, address, city, postalCode, country })
    );
    history.push("/payment");
  };
  return (
    <>
      <div>
        <CheckoutSteps step1 step2></CheckoutSteps>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Shipping Address</h1>
          </div>
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setcity(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="postalCode">PostalCode</label>
            <input
              type="text"
              id="postalCode"
              placeholder="Enter Postal Code"
              value={postalCode}
              onChange={(e) => setpostalCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              placeholder="Enter Country"
              value={country}
              onChange={(e) => setcountry(e.target.value)}
              required
            />
          </div>
          <div>
            <label />
            <button className="primary" type="submit">
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShippingAddressScreen;
