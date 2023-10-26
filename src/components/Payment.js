import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'
import CheckoutProduct from './CheckoutProduct'
import '../styles/payment.css'
import { useElements, CardElement, useStripe } from '@stripe/react-stripe-js'
import { getBasketTotal } from '../reducer'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
const Payment = () => {
    const navigate = useNavigate()
    const [{ basket, user }, dispatch] = useStateValue()
    const stripe = useStripe()
    const elements = useElements();
    const [processing, setProcessing] = useState('')
    const [succeeded, setSucceeded] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState(null)
    const [clientSecret, setClientSecret] = useState(true)
    useEffect(() => {
        const client_secret = async () => {
            const response = await axios(
                {
                    method: 'post',
                    url: `/payment/create?total=${getBasketTotal(basket) * 100}`
                }
            )
            setClientSecret(response.data.clientSecret)
        }
        client_secret()
    }, [basket])

    console.log('secret key: ', clientSecret)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        }).then(({ paymentIntent }) => {
            const orderDoc = doc(collection(db, `users/${user?.uid}/orders`), paymentIntent.id);
            try {
                setDoc(orderDoc, {
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created,
                });
            } catch (error) {
                console.error('Error adding document: ', error);
            }
            setSucceeded(true)
            console.log({ clientSecret });
            setError(null)
            setProcessing(false)
            dispatch({
                type: 'EMPTY_BASKET'
            })
            navigate('/orders')
        })
    }
    const handleChange = e => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }
    return (
        <div className='payment'>
            <div className='payment__container'>
                <h1>
                    Checkout ({basket?.length} items)
                </h1>
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Shipping Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user?.email}</p>
                        <p>25200 Carlos Bee Blvd</p>
                        <p>Apt 395</p>
                        <p>Hayward, CA - 94542</p>
                    </div>
                </div>

                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items for delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item =>
                            <CheckoutProduct
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        )}
                    </div>
                </div>

                <div className='payment__section'>
                    <div className='payment__section'><h3>Payment Methods</h3></div>
                    <div className='payment__details'>
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />
                            <div className='payment__priceContainer'>
                                <p>
                                    Total : <strong>{formatCurrency(getBasketTotal(basket))}</strong>
                                </p>
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : 'Buy Now'}</span>
                                </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment