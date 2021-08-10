import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { listOrderMine } from "../redux/orderActions";

const OrderHistoryScreen = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const orderMineList = useSelector((state) => state.orderMineList);
  const { orders, loading, error } = orderMineList;

  useEffect(() => {
    dispatch(listOrderMine());
  }, []);

  return (
    <>
      <div>
        <h1>Order History</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox></MessageBox>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? "Yes" : "NO"}</td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "NO"}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => history.push(`/order/${order._id}`)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default OrderHistoryScreen;
