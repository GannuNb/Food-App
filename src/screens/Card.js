import React, { useState, useRef, useEffect } from 'react';
import { useDispatchCart, useCart } from '../components/ContextReducer';

export default function Card(props) {
  let options = props.options;
  let priceOptions = Object.keys(options);
  let dispatch = useDispatchCart();
  let data = useCart();

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(priceOptions[0] || "");
  const priceRef = useRef();

  
  let finalPrice = qty * parseInt(options[size] || 0);

  const handleAddToCart = async () => {
    let existingItem = data.find(
      (item) => item.id === props.foodItem._id && item.size === size
    );

    if (existingItem) {
      await dispatch({
        type: "UPDATE",
        id: props.foodItem._id,
        img:props.foodItem.img,
        price: finalPrice,
        qty: qty,
        size: size,
      });
    } else {
      await dispatch({
        type: "ADD",
        id: props.foodItem._id,
       
        name: props.foodItem.name,
        price: finalPrice,
        qty: qty,
        size: size,
        img: props.img,
      });
    }

    console.log(data);
  };

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  useEffect(() => {
    console.log('Cart data:', data);
  }, [data]);

  return (
    <div>
      <div className="card mt-3 ml-4" style={{ width: "17rem", maxHeight: "360px" }}>
        <img
          src={props.foodItem.img}
          className="card-img-top"
          alt="card-image"
          style={{ height: "120px", objectFit: "fill" }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.foodItem.name}</h5>

          <div className='container w-100 p-0' style={{ height: "38px" }}>
            <select
              className="m-2 h-80 w-20 bg-success rounded text-black rounded"
              onChange={(e) => setQty(e.target.value)}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select
              className="m-2 h-100 w-20 bg-success rounded text-black rounded"
              ref={priceRef}
              onChange={(e) => setSize(e.target.value)}
            >
              {priceOptions.map((data) => (
                <option key={data} value={data}>{data}</option>
              ))}
            </select>

            <div className='d-inline ms-2 h-100 w-20 fs-5'>
              ₹{finalPrice}/-
            </div>
          </div>
          <hr />
          <button className="btn btn-success justify-center ms-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
