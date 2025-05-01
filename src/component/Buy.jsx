import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Buy.css';
import Rating from './Rating';
import ContactSeller from './ContactSeller';
import SendMessage from './SendMessage';
import { io } from 'socket.io-client';
import RealTimeChat from './RealTimeChat';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas here

const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const BuyProducts = () => {
    const [products, setProducts] = useState([]);
    const [ratings, setRatings] = useState({});
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [selectedState, setSelectedState] = useState("");
    const [chatVisible, setChatVisible] = useState(false);
    const [selectedProductForChat, setSelectedProductForChat] = useState(null);
    const [upiUrl, setUpiUrl] = useState(""); // ➡️ For QR Code
    const chatRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:5000');

        socket.current.on('connect', () => {
            console.log('Frontend connected to Socket.IO server:', socket.current.id);
        });

        socket.current.on('disconnect', () => {
            console.log('Frontend disconnected from Socket.IO server');
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
        };

        fetchProducts();
    }, []);

    const handleContact = useCallback((contact, productId) => {
        setSelectedProductForChat(productId);
        setChatVisible(true);
        if (socket.current) {
            socket.current.emit('joinProductRoom', productId);
        }
    }, []);

    const handleCloseChat = () => {
        setChatVisible(false);
        setSelectedProductForChat(null);
        if (socket.current && selectedProductForChat) {
            socket.current.emit('leaveProductRoom', selectedProductForChat);
        }
    };

    const handleClickOutsideChat = (event) => {
        if (chatRef.current && !chatRef.current.contains(event.target)) {
            setChatVisible(false);
            setSelectedProductForChat(null);
            if (socket.current && selectedProductForChat) {
                socket.current.emit('leaveProductRoom', selectedProductForChat);
            }
        }
    };

    useEffect(() => {
        if (chatVisible) {
            document.addEventListener("mousedown", handleClickOutsideChat);
        } else {
            document.removeEventListener("mousedown", handleClickOutsideChat);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideChat);
        };
    }, [chatVisible, selectedProductForChat]);

    // 🛒 Add to Cart
    const handleAddToCart = (productId) => {
        const product = products.find((p) => p._id === productId);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingIndex = cart.findIndex((item) => item.id === productId);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: `http://localhost:5000/uploads/${product.image}`,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${product.name} to cart`);
    };

    // ⭐ Handle Rating
    const handleRating = (productId, rating) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [productId]: rating,
        }));
    };

    // 🌟 NEW 🌟 Handle Buy Now with UPI and QR
    const handleBuyNow = (product) => {
        const sellerPhone = product.contact.phone;
        const sellerName = product.contact.email.split('@')[0];
        const amount = product.price;

        const upiId = `${sellerPhone}@upi`;
        const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(sellerName)}&am=${amount}&cu=INR`;

        setUpiUrl(upiPaymentUrl); // ➡️ Set URL for QR display
    };

    const filteredProducts = selectedState
        ? products.filter((p) => p.location.trim().toLowerCase() === selectedState.trim().toLowerCase())
        : products;

    const toggleExpand = (productId) => {
        setExpandedProductId((prevId) => (prevId === productId ? null : productId));
    };

    const handleCloseQRCode = () => {
        setUpiUrl("");
    };

    return (
        <div className="buy-products">
            <h2>Buy Fresh Products</h2>

            <div className="state-filter">
                <label htmlFor="state">Filter by State: </label>
                <select id="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                    <option value="">All States</option>
                    {statesOfIndia.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            <div className="product-list">
                {filteredProducts.map((product) => {
                    const isExpanded = expandedProductId === product._id;
                    return (
                        <div
                            key={product._id}
                            className={`product-card ${isExpanded ? "expanded" : ""}`}
                            onClick={() => toggleExpand(product._id)}
                        >
                            <img
                                src={`http://localhost:5000/uploads/${product.image}`}
                                alt={product.name}
                                className="product-image"
                            />
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">₹{product.price} per unit</p>
                            <p className="product-location">Location: {product.location}</p>
                            <p className="product-stock">
                                {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
                            </p>

                            {isExpanded && (
                                <>
                                    <p className="product-type">Category: {product.category}</p>
                                    <p className="product-quantity">Quantity: {product.quantity}</p>
                                    <p className="product-description">{product.description}</p>
                                    <p className="product-harvest">Harvested on: {product.harvestDate}</p>

                                    <Rating
                                        rating={ratings[product._id] || 0}
                                        setRating={(rating) => handleRating(product._id, rating)}
                                    />

                                    <div className="button-group">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContact(product.contact, product._id);
                                            }}
                                            className="contact-button"
                                        >
                                            Contact
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product._id);
                                            }}
                                            className="cart-button"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBuyNow(product); // 🔥 Pass whole product
                                            }}
                                            className="buy-now-button"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 🔥 QR Code Modal */}
            {upiUrl && (
                <div className="qr-code-modal" onClick={handleCloseQRCode}>
                    <div className="qr-code-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Scan to Pay</h3>
                        <QRCodeCanvas value={upiUrl} size={250} />
                        <p className="upi-text">Or open UPI app and scan</p>
                        <button onClick={handleCloseQRCode} className="close-qr-button">Close</button>
                    </div>
                </div>
            )}

            {chatVisible && selectedProductForChat && (
                <div ref={chatRef} className="contact-modal">
                    <RealTimeChat socket={socket.current} productId={selectedProductForChat} onClose={handleCloseChat} />
                </div>
            )}
        </div>
    );
};

export default BuyProducts;
