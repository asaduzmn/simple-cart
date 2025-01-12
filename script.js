let products = [];
const cart = [];
let discount = 0;

async function fetchProducts() {
    const response = await fetch('products.json');
    products = await response.json();
    displayProducts();
}


document.addEventListener('DOMContentLoaded', (event) => {
    updateCart(); // Update cart on page load
});

function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">TK. ${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const discountedTotal = document.getElementById('discounted-total');
    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            ${item.name} - Tk. ${item.price} x ${item.quantity}
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
        itemCount += item.quantity;
    });
    cartTotal.textContent = `Total: Tk. ${total.toFixed(2)}`;
    cartCount.textContent = itemCount;

    if(total > 0){
        // count discount
        const discountedAmount = total * discount;
        const finalTotal = total - discountedAmount;
        // discountedTotal.textContent = discount > 0 ? `Discounted Total: Tk. ${finalTotal.toFixed(2)}` : '';
        if (discount > 0) {
            discountedTotal.innerHTML = `
                <p>Discount: Tk. ${discountedAmount.toFixed(2)}</p>
                <p>Final Total: Tk. ${finalTotal.toFixed(2)}</p>
            `;
        } else {
            discountedTotal.innerHTML = '';
        }
    }else{
        discountedTotal.innerHTML = '';
    }


    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (cart.length > 0) {
        placeOrderBtn.style.display = 'inline-block';
    } else {
        placeOrderBtn.style.display = 'none';
    }
}

function updateQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        const parsedQuantity = parseInt(quantity);
        cartItem.quantity = parsedQuantity > 0 ? parsedQuantity : 1; // Prevent negative quantities
    }
    updateCart();
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
    }
    if(cart.length === 0){
        discount = 0;
    }
    updateCart();
}

function clearCart() {
    cart.length = 0;
    discount = 0;
    updateCart();
}

function toggleCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const overlay = document.getElementById('overlay');
    const isVisible = cartModal.style.display === 'block';
    cartModal.style.display = isVisible ? 'none' : 'block';
    overlay.style.display = isVisible ? 'none' : 'block';
}


//discount
function applyPromoCode() {
    if (cart.length === 0) {
        alert('Cart is empty');
        document.getElementById('promo-code-input').value = '';
        return;
    }

    const promoCodeInput = document.getElementById('promo-code-input').value;
    if (promoCodeInput === 'ostad10') {
        discount = 0.10;
    } else if (promoCodeInput === 'ostad5') {
        discount = 0.05;
    } else {
        discount = 0;
        alert('Invalid promo code');
    }
    // Clear the input field 
    document.getElementById('promo-code-input').value = '';
    updateCart();
}


//oder place
function placeOrder() {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountedAmount = total * discount;
    const finalTotal = total - discountedAmount;

    const order = {
        items: cart.map(item => ({ product: item.name, quantity: item.quantity })),
        total: finalTotal
    };
    console.log(order);
    clearCart();
    toggleCartModal();
    alert('Order placed successfully! Thank you for shopping with us! check console for order details');
}

fetchProducts();