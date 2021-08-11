import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUserProfile } from "../redux/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useState } from "react";
import { USER_UPDATE_PROFILE_REST } from "../redux/userConstants";

const ProfileScreen = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error } = userDetails;
  const dispatch = useDispatch();
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    success: successUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
  } = userUpdateProfile;
  useEffect(() => {
    dispatch({ type: USER_UPDATE_PROFILE_REST });
    if (!user) {
      dispatch(detailsUser(userInfo._id));
    } else {
      setname(user.name);
      setemail(user.email);
      if (user.seller) {
        setSellerName(user.seller.name);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
      }
    }
  }, [dispatch, user, userInfo._id]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      alert("Passwords are not matching");
    } else {
      dispatch(
        updateUserProfile({
          userId: user._id,
          name,
          email,
          password,
          sellerName,
          sellerLogo,
          sellerDescription,
        })
      );
    }
  };
  return (
    <>
      <div>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>User Profile</h1>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {loadingUpdate && <LoadingBox></LoadingBox>}
              {errorUpdate && (
                <MessageBox variant="danger"> {errorUpdate}</MessageBox>
              )}
              {successUpdate && (
                <MessageBox variant="success">
                  Profile Updated Successfully
                </MessageBox>
              )}
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="cpassword">Confirm Password</label>
                <input
                  type="password"
                  id="cpassword"
                  placeholder="Confirm password"
                  onChange={(e) => setcpassword(e.target.value)}
                />
              </div>
              {user.isSeller && (
                <>
                  <h2>Seller</h2>
                  <div>
                    <label htmlFor="sellerName">Seller Name</label>
                    <input
                      id="sellerName"
                      type="text"
                      placeholder="Enter Seller Name"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="sellerLogo">Seller Logo</label>
                    <input
                      id="sellerLogo"
                      type="text"
                      placeholder="Enter Seller Logo"
                      value={sellerLogo}
                      onChange={(e) => setSellerLogo(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="sellerDescription">
                      Seller Description
                    </label>
                    <input
                      id="sellerDescription"
                      type="text"
                      placeholder="Enter Seller Description"
                      value={sellerDescription}
                      onChange={(e) => setSellerDescription(e.target.value)}
                    ></input>
                  </div>
                </>
              )}
              <div>
                <label></label>
                <button className="primary" type="submit">
                  Update
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default ProfileScreen;
