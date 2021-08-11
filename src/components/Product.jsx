import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
const Product = ({ product }) => {
  return (
    <>
      <div className="card-main">
        <Link to={`/product/${product._id}`}>
          <img
            className="medium"
            src={
              product.image.indexOf("/uploads") >= 0
                ? `https://ecomb.herokuapp.com${product.image}`
                : product.image
            }
            alt="product"
          />
        </Link>
        <div className="card-body">
          <Link to={`product/${product._id}`}>
            <h2>{product.name}</h2>
          </Link>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <div className="row">
            <div className="price">${product.price}</div>
            <div>
              {product.seller.name ||
                (product.seller && (
                  <Link to={`/seller/${product.seller._id}`}>
                    {product.seller.seller.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
