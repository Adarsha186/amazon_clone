import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Order from './Order'
import '../styles/order.css'
const Orders = () => {
    const [{ basket, user }, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const ordersQuery = query(collection(db, 'users', user?.uid, 'orders'), orderBy('created', 'desc'));
        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            setOrders(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            })));
        });

        return () => {
            unsubscribe();
        };
    }, [user?.uid]);
    return (
        <div className='orders'>
            <h1>Your Orders</h1>
            <div className='orders__order'>
                {orders?.map(order => {
                    return <Order key={order.id} order={order} />
                })}
            </div>
        </div>
    )
}

export default Orders