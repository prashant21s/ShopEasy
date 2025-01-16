// Product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        description: "High-quality wireless headphones with noise cancellation and long battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        description: "Feature-rich smartwatch with health tracking and notifications.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 49.99,
        description: "Durable and water-resistant backpack with laptop compartment.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
    },
    {
        id: 4,
        name: "Portable Speaker",
        price: 79.99,
        description: "Compact bluetooth speaker with amazing sound quality.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    showAddedToCartMessage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            if (window.location.pathname.includes('cart.html')) {
                renderCart();
            }
        }
    }
}

function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.className = 'added-to-cart-message';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.375rem;
        animation: slideIn 0.3s ease-out;
    `;
    message.textContent = 'Added to cart!';
    document.body.appendChild(message);

    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

// Product listing
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn-primary" onclick="showProductDetails(${product.id})">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Product modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-details');

    modalContent.innerHTML = `
        <div class="product-details">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 0.5rem;">
            <h2 style="margin: 1rem 0">${product.name}</h2>
            <p style="margin-bottom: 1rem">${product.description}</p>
            <p class="product-price" style="margin-bottom: 1rem">$${product.price.toFixed(2)}</p>
            <button class="btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;

    modal.style.display = 'block';

    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Cart page
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn-primary" style="margin-left: 1rem" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
}

// Checkout page
function renderOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    if (!orderItems || !orderTotal) return;

    orderItems.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    orderTotal.textContent = total.toFixed(2);
}

// Form handling
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        alert('Order placed successfully! Thank you for shopping with us.');
        cart = [];
        saveCart();
        window.location.href = 'index.html';
    };
}

// Initialize page
function initializePage() {
    updateCartCount();
    renderProducts();
    renderCart();
    renderOrderSummary();
    setupCheckoutForm();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);