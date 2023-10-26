import React, { useEffect, useState } from "react";
import Product from "./Product";
import '../styles/home.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useStateValue } from "../StateProvider";

const Home = () => {
    const [{ searchInput }] = useStateValue();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products');
            const productsQuery = query(productsCollection, where('title', '>=', searchInput));

            try {
                const productsSnapshot = await getDocs(productsQuery);
                const updatedProducts = productsSnapshot.docs.map(doc => doc.data());
                setFilteredProducts(updatedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [searchInput]);

    return (
        <div className="home">
            <div className="home__container">
                <img
                    className="home__image"
                    src="https://m.media-amazon.com/images/I/71etCBcXcbL._SX3000_.jpg"
                    alt=""
                />

                <div className="home__row">
                    {filteredProducts.map(product => (
                        <Product
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            rating={product.rating}
                            image={product.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
