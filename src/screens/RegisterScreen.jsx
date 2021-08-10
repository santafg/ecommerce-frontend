import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const RegisterScreen = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const location = useLocation();
  const history = useHistory();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      alert("Passwords are not matching");
    } else {
      dispatch(register(name, email, password));
    }
  };

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo]);
  return (
    <>
      <div>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Register</h1>
          </div>
          {loading && <LoadingBox />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              required
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email Adress</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              required
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              required
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div></div>
          <div>
            <label htmlFor="cpassword">Confirm password</label>
            <input
              type="password"
              id="cpassword"
              placeholder="Confirm password"
              required
              onChange={(e) => setcpassword(e.target.value)}
            />
          </div>
          <div>
            <label />
            <button className="primary" type="submit">
              Register
            </button>
          </div>
          <div>
            <label />
            <div>
              Already have an account ? <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterScreen;
