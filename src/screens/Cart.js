import React from 'react';
import Delete from '@mui/icons-material/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    );
  }

  const handleRemove = (index) => {
    dispatch({ type: "REMOVE", index: index });
  };

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let totalPrice = data.reduce((total, food) => total + food.price, 0);
    let gst = totalPrice * 0.18;
    let finalPrice = totalPrice + gst;

    let response = await fetch("http://localhost:5000/api/auth/OrderData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        total_price: totalPrice,
        gst: gst,
        final_price: finalPrice,
        order_date: new Date().toDateString()
      })
    });
    

    if (response.status === 200) {
      dispatch({ type: "DROP" });
      alert("Checkout successful! An email with your order details has been sent.");
    } else {
      console.error("Failed to checkout:", response.statusText);
      alert("Checkout failed. Please try again.");
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);
  let gst = totalPrice * 0.18;
  let finalPrice = totalPrice + gst;

  return (
    <div>
      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
        <table className='table table-hover'>
          <thead className='text-success fs-4'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Image</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>
                  <img src={food.img} alt={food.name} style={{ width: '100px', height: 'auto' }} />
                </td>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price.toFixed(2)}</td>
                <td>
                  <button type="button" className="btn p-0" onClick={() => handleRemove(index)}>
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Total Price: {totalPrice.toFixed(2)}/-</h1>
          <h2 style={{ fontSize: '1.25rem' }}>GST (18%): {gst.toFixed(2)}/-</h2>
          <h2 style={{ fontSize: '1.8rem' }}>Final Amount: {finalPrice.toFixed(2)}/-</h2>
        </div>
        <div>
          <button className='btn bg-success mt-5' onClick={handleCheckOut}> Check Out </button>
        </div>
      </div>
    </div>
  );
}
