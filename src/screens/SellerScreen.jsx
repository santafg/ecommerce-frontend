import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { listProducts } from "../redux/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { sellerDetails } from "../redux/userActions";
import { SELLER_DETAILS_RESET } from "../redux/userConstants";

export default function SellerScreen() {
  const { id } = useParams();

  const detailsOfSeller = useSelector(state => state.detailsOfSeller);
  const {loading , seller , error} = detailsOfSeller ;
  const productList = useSelector((state) => state.productList);
  const {
    loading: loadingProducts,
    error: errorProducts,
    products,
  } = productList;

  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({type: SELLER_DETAILS_RESET});
    dispatch(sellerDetails(id));
    dispatch(listProducts({ seller: id }));
  }, [dispatch, id]);
  return (
    <div className="row top">
      <div className="col-1">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">Seller not found</MessageBox>
        ) : ( seller &&
          <ul className="card card-body">
            <li>
              <div className="row start">
                <div className="p-1">
                  <img
                    className="small"
                    src={seller.seller.logo}
                    alt={seller.seller.name}
                  ></img>
                </div>
                <div className="p-1">
                  <h1>{seller.seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating
                rating={seller.seller.rating}
                numReviews={seller.seller.numReviews}
              ></Rating>
            </li>
            <li>
              <a href={`mailto:${seller.email}`}>Contact Seller</a>
            </li>
            <li>{seller.seller.description}</li>
          </ul>
        )}
      </div>
      <div className="col-3">
        {loadingProducts ? (
          <LoadingBox></LoadingBox>
        ) : errorProducts ? (
          <MessageBox variant="danger">{errorProducts}</MessageBox>
        ) : (
          <>
            {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
            <div className="row center">
              {products.map((product) => (
                <Product key={product._id} product={product}></Product>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
