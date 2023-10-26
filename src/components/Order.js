import React from 'react'
import '../styles/order.css'
import moment from 'moment/moment'
import CheckoutProduct from './CheckoutProduct'
const Order = ({ order }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    return (
        <div className='order'>
            <h2>Order</h2>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p>{moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}</p>
            {order.data.basket?.map(item =>
                <CheckoutProduct
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                    hideButton
                />
            )}
            <p>
                Order Value : <strong>{formatCurrency(order.data.amount / 100)}</strong>
            </p>
        </div>
    )
}

export default Order