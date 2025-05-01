import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Buy.css';
import Rating from './Rating';
import RealTimeChat from './RealTimeChat';
import { io } from 'socket.io-client';
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
    const [searchQuery, setSearchQuery] = useState(""); // <-- New search state
    const [chatVisible, setChatVisible] = useState(false);
    const [selectedProductForChat, setSelectedProductForChat] = useState(null);
    const [upiUrl, setUpiUrl] = useState(""); // ➡️ For QR Code
    const chatRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:5000');
        socket.current.on('connect', () => console.log('Socket connected', socket.current.id));
        socket.current.on('disconnect', () => console.log('Socket disconnected'));
        return () => socket.current.disconnect();
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
        socket.current.emit('joinProductRoom', productId);
    }, []);

    const handleCloseChat = () => {
        socket.current.emit('leaveProductRoom', selectedProductForChat);
        setChatVisible(false);
        setSelectedProductForChat(null);
    };

    const handleClickOutsideChat = (event) => {
        if (chatRef.current && !chatRef.current.contains(event.target)) {
            handleCloseChat();
        }
    };

    useEffect(() => {
        if (chatVisible) document.addEventListener("mousedown", handleClickOutsideChat);
        else document.removeEventListener("mousedown", handleClickOutsideChat);
        return () => document.removeEventListener("mousedown", handleClickOutsideChat);
    }, [chatVisible]);

    const handleAddToCart = (productId) => {
        const product = products.find(p => p._id === productId);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const idx = cart.findIndex(item => item.id === productId);
        if (idx > -1) cart[idx].quantity += 1;
        else cart.push({ id: productId, name: product.name, price: product.price, quantity: 1, image: `http://localhost:5000/uploads/${product.image}` });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${product.name} to cart`);
    };

    const handleRating = (productId, rating) => {
        setRatings(prev => ({ ...prev, [productId]: rating }));
    };

    const handleBuyNow = (product) => {
        const sellerPhone = product.contact.phone;
        const sellerName = product.contact.email.split('@')[0];
        const amount = product.price;
        const upiPaymentUrl = `upi://pay?pa=${sellerPhone}@upi&pn=${encodeURIComponent(sellerName)}&am=${amount}&cu=INR`;
        setUpiUrl(upiPaymentUrl);
    };

    // Filter by state and search query
    const stateFiltered = selectedState
        ? products.filter(p => p.location.toLowerCase() === selectedState.toLowerCase())
        : products;

    const filteredProducts = stateFiltered.filter(p => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            p.name.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.price.toString().includes(q)
        );
    });

    return (
        <div className="buy-products">
            <h2>Buy Fresh Products</h2>

            <div className="controls">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by name, location, category or price..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="state-filter">
                    <label htmlFor="state">Filter by State:</label>
                    <select id="state" value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                        <option value="">All States</option>
                        {statesOfIndia.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>
            </div>

            <div className="product-list">
                {filteredProducts.map(product => {
                    const isExpanded = expandedProductId === product._id;
                    return (
                        <div key={product._id} className={`product-card ${isExpanded ? 'expanded' : ''}`} onClick={() => setExpandedProductId(id => id === product._id ? null : product._id)}>
                            <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="product-image" />
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">₹{product.price} per unit</p>
                            <p className="product-location">Location: {product.location}</p>
                            <p className="product-stock">{product.inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>

                            {isExpanded && (
                                <>  
                                    <p>Category: {product.category}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>{product.description}</p>
                                    <p>Harvested on: {product.harvestDate}</p>

                                    <Rating rating={ratings[product._id] || 0} setRating={r => handleRating(product._id, r)} />

                                    <div className="button-group">
                                        <button onClick={e => { e.stopPropagation(); handleContact(product.contact, product._id); }} className="contact-button">Contact</button>
                                        <button onClick={e => { e.stopPropagation(); handleAddToCart(product._id); }} className="cart-button">Add to Cart</button>
                                        <button onClick={e => { e.stopPropagation(); handleBuyNow(product); }} className="buy-now-button">Buy Now</button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {upiUrl && <div className="qr-code-modal" onClick={() => setUpiUrl('')}><div className="qr-code-box"><h3>Scan to Pay</h3><QRCodeCanvas value={upiUrl} size={250} /><p>Or open UPI app and scan</p><button onClick={() => setUpiUrl('')}>Close</button></div></div>}

            {chatVisible && selectedProductForChat && (
                <div ref={chatRef} className="contact-modal">
                    <RealTimeChat
                        socket={socket.current}
                        productId={selectedProductForChat}
                        sellerInfo={products.find(p => p._id === selectedProductForChat)?.contact}
                        onClose={handleCloseChat}
                    />
                </div>
            )}
        </div>
    );
};

export default BuyProducts;
