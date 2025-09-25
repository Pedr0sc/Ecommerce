// Products data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 7999.99,
        category: "smartphone",
        description: "O mais avançado iPhone com chip A17 Pro e câmera de 48MP",
        icon: "📱",
        image: "imagens/iphone15pro.jpg",
    },
    {
        id: 2,
        name: "MacBook Air M2",
        price: 9999.99,
        category: "laptop",
        description: "Notebook ultra-fino com chip M2 e 16GB de RAM",
        icon: "💻",
        image: "imagens/Macbook Air M2.webp"
    },
    {
        id: 3,
        name: "AirPods Pro",
        price: 1899.99,
        category: "accessory",
        description: "Fones com cancelamento ativo de ruído",
        icon: "🎧",
        image: "imagens/AirPods Pro.webp"
    },
    {
        id: 4,
        name: "iPad Pro 12.9",
        price: 8499.99,
        category: "tablet",
        description: "Tablet profissional com tela Liquid Retina XDR",
        icon: "📱",
        image: "imagens/IPad Pro 12.9.webp"
    },
    {
        id: 5,
        name: "Samsung Galaxy S24",
        price: 5999.99,
        category: "smartphone",
        description: "Smartphone Android com câmera de 200MP e IA integrada",
        icon: "📱",
        image: "imagens/Samsung Galaxy S24.webp"
    },
    {
        id: 6,
        name: "Dell XPS 13",
        price: 7499.99,
        category: "laptop",
        description: "Ultrabook premium com tela InfinityEdge",
        icon: "💻",
        image: "imagens/Dell XPS 13.avif"
    },
    {
        id: 7,
        name: "Magic Mouse",
        price: 699.99,
        category: "accessory",
        description: "Mouse sem fio com superfície Multi-Touch",
        icon: "🖱️",
        image: "imagens/Magic Mouse.jpg"
    },
    {
        id: 8,
        name: "iPad Air",
        price: 4999.99,
        category: "tablet",
        description: "iPad com chip M1 e suporte ao Apple Pencil",
        icon: "📱",
        image: "imagens/Ipad Air.jpeg"
    },
    {
        id: 9,
        name: "Google Pixel 8",
        price: 4799.99,
        category: "smartphone",
        description: "Smartphone Google com IA avançada e câmera excepcional",
        icon: "📱",
        image: "imagens/Google Pixel 8.jpg"
    },
    {
        id: 10,
        name: "Surface Pro 9",
        price: 8999.99,
        category: "tablet",
        description: "Tablet 2-em-1 da Microsoft com Windows 11",
        icon: "📱",
        image: "imagens/Surface Pro 9.jpeg"
    },
    {
        id: 11,
        name: "Mechanical Keyboard",
        price: 899.99,
        category: "accessory",
        description: "Teclado mecânico RGB com switches Cherry MX",
        icon: "⌨️",
        image: "imagens/Mechanical Keyboard.jpeg"
    },
    {
        id: 12,
        name: "Asus ROG Laptop",
        price: 12999.99,
        category: "laptop",
        description: "Notebook gamer com RTX 4070 e Ryzen 9",
        icon: "💻",
        image: "imagens/Asus ROG Laptop.png",
    }
];

let cart = [];
let currentFilter = 'all';

// Inicia a loja
function init() {
    renderProducts();
    updateCartCount();
}

// renderiza os produtos 
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            
            <img class="product-image" src="${product.image}" alt="${product.name}">

            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                <div class="product-description">${product.description}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id}, this)">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

//Filtra os produtos 
function filterProducts(category, el) {
    currentFilter = category;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    el.classList.add('active');

    renderProducts();
}

// Adiciona produtos ao carrinho 
function addToCart(productId, el) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showAddedToCartAnimation(el);
}

// Mostra quando adiciona produto no carrinho
function showAddedToCartAnimation(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = '✅ Adicionado!';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }, 500);
}

// adiona o intem ao carrinho na contagem 
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
    
    if (count > 0) {
        document.querySelector('.cart-count').style.display = 'flex';
    } else {
        document.querySelector('.cart-count').style.display = 'none';
    }
}

// alterna o modal 
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const isVisible = modal.classList.contains('show');
    
    if (isVisible) {
        modal.classList.remove('show');
    } else {
        modal.classList.add('show');
        renderCart();
    }
}

// renderizando os intens 
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Seu carrinho está vazio 😔</div>';
        cartTotal.textContent = '0,00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <span class="remove-item" onclick="removeFromCart(${item.id})">🗑️</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString('pt-BR', {minimumFractionDigits: 2});
}

// incrementa elementos no carrinhoo 
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
        }
    }
}

// remove item 
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// Check
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Salva o carrinho no armazenamento local
    localStorage.setItem('techStoreCart', JSON.stringify(cart));
    
    // Redireciona para a página de checkout
    window.location.href = 'checkout.html';
}

// ao clicar fora fecha o modal 
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                toggleCart();
            }
        });
    }
    
    // Initialize the store
    init();
});