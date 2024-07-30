import React, { useEffect, useState } from 'react';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const [error, setError] = useState(null);

    const fetchMyOrder = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/myOrderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail')
                })
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                console.error('Error response from server:', errorResponse);
                throw new Error(`Network response was not ok: ${response.status} - ${errorResponse}`);
            }

            const data = await response.json();
            console.log('Order data fetched:', data);
            setOrderData(data.orderData.order_data);
        } catch (error) {
            setError(error.message);
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    {error ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : (
                        orderData.length > 0 ? orderData.slice(0).reverse().map((order, index) => (
                            <div key={index} className='col-12'>
                                {order[0].order_date && (
                                    <div className='m-auto mt-5'>
                                        {order[0].order_date}
                                        <hr />
                                    </div>
                                )}
                                {order.slice(1).map((arrayData, idx) => (
                                    <div key={`${index}-${idx}`} className='col-12 col-md-6 col-lg-3'>
                                        <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                            <img src={arrayData.img} className="card-img-top" alt={arrayData.name} style={{ height: "120px", objectFit: "fill" }} />
                                            <div className="card-body">
                                                <h5 className="card-title">{arrayData.name}</h5>
                                                <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                    <span className='m-1'>{arrayData.qty}</span>
                                                    <span className='m-1'>{arrayData.size}</span>
                                                    <span className='m-1'>{order[0].order_date}</span>
                                                    <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                        ₹{arrayData.price}/-
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )) : <div>Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
