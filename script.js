document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        { id: 1, name: 'Smart TV 55" 4K UHD', price: 12500, category: 'Televisores', stock: 15 },
        { id: 2, name: 'Refrigerador Side by Side', price: 18999, category: 'Línea Blanca', stock: 8 },
        { id: 3, name: 'Lavadora Carga Frontal 18kg', price: 14500, category: 'Línea Blanca', stock: 12 },
        { id: 4, name: 'Microondas 1.5 pies cúbicos', price: 3200, category: 'Electrodomésticos', stock: 20 },
        { id: 5, name: 'Licuadora Profesional', price: 1800, category: 'Electrodomésticos', stock: 25 },
        { id: 6, name: 'Aspiradora Robot', price: 6500, category: 'Electrodomésticos', stock: 10 },
        { id: 7, name: 'Aire Acondicionado 2 Ton', price: 21500, category: 'Climatización', stock: 6 },
        { id: 8, name: 'Horno Eléctrico Empotrable', price: 9500, category: 'Electrodomésticos', stock: 7 }
    ];

    // DOM Elements
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const productList = document.querySelector('.product-list');
    const cartItems = document.querySelector('.cart-items tbody');
    const subtotalElement = document.querySelector('.subtotal span:last-child');
    const taxElement = document.querySelector('.tax span:last-child');
    const totalElement = document.querySelector('.total span:last-child');
    const checkoutButton = document.querySelector('.btn-checkout');

    // Cart state
    let cart = [];

    // Display products
    function displayProducts(productsToDisplay) {
        productList.innerHTML = '';
        
        productsToDisplay.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>$${product.price.toLocaleString()} - ${product.stock} disponibles</p>
                </div>
                <button class="btn-add" data-id="${product.id}">
                    <i class="fas fa-plus"></i>
                </button>
            `;
            productList.appendChild(productItem);
        });

        // Add event listeners to add buttons
        document.querySelectorAll('.btn-add').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Add to cart function
    function addToCart(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                } else {
                    alert('No hay suficiente stock disponible');
                    return;
                }
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }
            
            updateCart();
        }
    }

    // Update cart display
    function updateCart() {
        cartItems.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toLocaleString()}</td>
                <td class="quantity">
                    <button class="btn-decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-increase" data-id="${item.id}">+</button>
                </td>
                <td>$${itemTotal.toLocaleString()}</td>
                <td><i class="fas fa-trash remove-item" data-id="${item.id}"></i></td>
            `;
            cartItems.appendChild(row);
        });
        
        // Calculate taxes and total
        const tax = subtotal * 0.16;
        const total = subtotal + tax;
        
        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        taxElement.textContent = `$${tax.toLocaleString()}`;
        totalElement.textContent = `$${total.toLocaleString()}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.btn-decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.btn-increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Quantity adjustment functions
    function decreaseQuantity(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
    }

    function increaseQuantity(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);
        
        if (item.quantity < product.stock) {
            item.quantity++;
            updateCart();
        } else {
            alert('No hay suficiente stock disponible');
        }
    }

    // Remove item function
    function removeItem(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Checkout function
    function checkout() {
        if (cart.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }
        
        // In a real app, you would send this data to a server
        const saleData = {
            date: new Date().toISOString(),
            items: cart,
            subtotal: parseFloat(subtotalElement.textContent.replace('$', '').replace(',', '')),
            tax: parseFloat(taxElement.textContent.replace('$', '').replace(',', '')),
            total: parseFloat(totalElement.textContent.replace('$', '').replace(',', ''))
        };
        
        console.log('Venta realizada:', saleData);
        alert(`Venta realizada por $${saleData.total.toLocaleString()}`);
        
        // Clear cart
        cart = [];
        updateCart();
        
        // In a real app, you would update the UI to show the new sale
    }

    // Search functionality
    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );
        
        displayProducts(filteredProducts);
    }

    // Event listeners
    searchButton.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    checkoutButton.addEventListener('click', checkout);

    // Initialize
    displayProducts(products);
});