// Classe para gerenciar um produto individual
class Product {
    constructor(id, name, price, category, description, icon, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
        this.icon = icon;
        this.image = image;
    }

    // Método para gerar HTML do produto
    toHTML() {
        return `
            <div class="product-card" data-category="${this.category}">
                <img class="product-image" src="${this.image}" alt="${this.name}">
                <div class="product-info">
                    <div class="product-name">${this.name}</div>
                    <div class="product-price">R$ ${this.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                    <div class="product-description">${this.description}</div>
                    <button class="add-to-cart" onclick="store.cart.addProduct(${this.id}, this)">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
    }
}

// Classe para gerenciar um item do carrinho
class CartItem {
    constructor(product, quantity = 1) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.category = product.category;
        this.description = product.description;
        this.icon = product.icon;
        this.image = product.image;
        this.quantity = quantity;
    }

    // Calcula o total do item
    getTotal() {
        return this.price * this.quantity;
    }

    // Gera HTML do item no carrinho
    toHTML() {
        return `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${this.name}</div>
                    <div class="item-price">R$ ${this.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="store.cart.updateQuantity(${this.id}, -1)">-</button>
                    <span class="quantity">${this.quantity}</span>
                    <button class="qty-btn" onclick="store.cart.updateQuantity(${this.id}, 1)">+</button>
                </div>
                <span class="remove-item" onclick="store.cart.removeItem(${this.id})">🗑️</span>
            </div>
        `;
    }
}

// Classe para gerenciar o carrinho de compras
class Cart {
    constructor() {
        this.items = [];
    }

    // Adiciona produto ao carrinho
    addProduct(productId, buttonElement) {
        const product = store.productCatalog.getProductById(productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(new CartItem(product));
        }
        
        this.updateCartCount();
        this.showAddedAnimation(buttonElement);
    }

    // Atualiza quantidade de um item
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.updateCartCount();
                this.render();
            }
        }
    }

    // Remove item do carrinho
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCartCount();
        this.render();
    }

    // Calcula total do carrinho
    getTotal() {
        return this.items.reduce((sum, item) => sum + item.getTotal(), 0);
    }

    // Conta total de itens
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Atualiza contador do carrinho na UI
    updateCartCount() {
        const count = this.getTotalItems();
        const cartCountElement = document.querySelector('.cart-count');
        cartCountElement.textContent = count;
        
        if (count > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }

    // Mostra animação de produto adicionado
    showAddedAnimation(button) {
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

    // Renderiza o carrinho
    render() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Seu carrinho está vazio 😔</div>';
            cartTotal.textContent = '0,00';
            return;
        }
        
        cartItemsContainer.innerHTML = this.items.map(item => item.toHTML()).join('');
        cartTotal.textContent = this.getTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2});
    }

    // Finaliza compra
    checkout() {
        if (this.items.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        // Salva o carrinho no armazenamento local
        localStorage.setItem('techStoreCart', JSON.stringify(this.items));
        
        // Redireciona para a página de checkout
        window.location.href = 'checkout.html';
    }

    // Limpa o carrinho
    clear() {
        this.items = [];
        this.updateCartCount();
        this.render();
    }
}

// Classe para gerenciar o catálogo de produtos
class ProductCatalog {
    constructor() {
        this.products = this.initializeProducts();
    }

    // Inicializa os produtos
    initializeProducts() {
        const productsData = [
            {
                id: 1, name: "iPhone 15 Pro", price: 7999.99, category: "smartphone",
                description: "O mais avançado iPhone com chip A17 Pro e câmera de 48MP",
                icon: "📱", image: "imagens/iphone15pro.jpg"
            },
            {
                id: 2, name: "MacBook Air M2", price: 9999.99, category: "laptop",
                description: "Notebook ultra-fino com chip M2 e 16GB de RAM",
                icon: "💻", image: "imagens/Macbook Air M2.webp"
            },
            {
                id: 3, name: "AirPods Pro", price: 1899.99, category: "accessory",
                description: "Fones com cancelamento ativo de ruído",
                icon: "🎧", image: "imagens/AirPods Pro.webp"
            },
            {
                id: 4, name: "iPad Pro 12.9", price: 8499.99, category: "tablet",
                description: "Tablet profissional com tela Liquid Retina XDR",
                icon: "📱", image: "imagens/IPad Pro 12.9.webp"
            },
            {
                id: 5, name: "Samsung Galaxy S24", price: 5999.99, category: "smartphone",
                description: "Smartphone Android com câmera de 200MP e IA integrada",
                icon: "📱", image: "imagens/Samsung Galaxy S24.webp"
            },
            {
                id: 6, name: "Dell XPS 13", price: 7499.99, category: "laptop",
                description: "Ultrabook premium com tela InfinityEdge",
                icon: "💻", image: "imagens/Dell XPS 13.avif"
            },
            {
                id: 7, name: "Magic Mouse", price: 699.99, category: "accessory",
                description: "Mouse sem fio com superfície Multi-Touch",
                icon: "🖱️", image: "imagens/Magic Mouse.jpg"
            },
            {
                id: 8, name: "iPad Air", price: 4999.99, category: "tablet",
                description: "iPad com chip M1 e suporte ao Apple Pencil",
                icon: "📱", image: "imagens/Ipad Air.jpeg"
            },
            {
                id: 9, name: "Google Pixel 8", price: 4799.99, category: "smartphone",
                description: "Smartphone Google com IA avançada e câmera excepcional",
                icon: "📱", image: "imagens/Google Pixel 8.jpg"
            },
            {
                id: 10, name: "Surface Pro 9", price: 8999.99, category: "tablet",
                description: "Tablet 2-em-1 da Microsoft com Windows 11",
                icon: "📱", image: "imagens/Surface Pro 9.jpeg"
            },
            {
                id: 11, name: "Mechanical Keyboard", price: 899.99, category: "accessory",
                description: "Teclado mecânico RGB com switches Cherry MX",
                icon: "⌨️", image: "imagens/Mechanical Keyboard.jpeg"
            },
            {
                id: 12, name: "Asus ROG Laptop", price: 12999.99, category: "laptop",
                description: "Notebook gamer com RTX 4070 e Ryzen 9",
                icon: "💻", image: "imagens/Asus ROG Laptop.png"
            }
        ];

        return productsData.map(data => new Product(
            data.id, data.name, data.price, data.category,
            data.description, data.icon, data.image
        ));
    }

    // Busca produto por ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Filtra produtos por categoria
    getProductsByCategory(category) {
        return category === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === category);
    }

    // Retorna todas as categorias
    getCategories() {
        const categories = [...new Set(this.products.map(product => product.category))];
        return ['all', ...categories];
    }
}

// Classe para gerenciar a interface da loja
class StoreUI {
    constructor(productCatalog, cart) {
        this.productCatalog = productCatalog;
        this.cart = cart;
        this.currentFilter = 'all';
        this.cartModal = null;
    }

    // Inicializa a UI
    init() {
        this.cartModal = document.getElementById('cart-modal');
        this.setupEventListeners();
        this.renderProducts();
        this.cart.updateCartCount();
    }

    // Configura event listeners
    setupEventListeners() {
        // Event listener para fechar modal ao clicar fora
        if (this.cartModal) {
            this.cartModal.addEventListener('click', (e) => {
                if (e.target === this.cartModal) {
                    this.toggleCart();
                }
            });
        }
    }

    // Renderiza produtos na grid
    renderProducts() {
        const grid = document.getElementById('products-grid');
        const filteredProducts = this.productCatalog.getProductsByCategory(this.currentFilter);
        
        grid.innerHTML = filteredProducts.map(product => product.toHTML()).join('');
    }

    // Filtra produtos por categoria
    filterProducts(category, element) {
        this.currentFilter = category;

        // Atualiza botões de filtro
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        element.classList.add('active');

        this.renderProducts();
    }

    // Alterna modal do carrinho
    toggleCart() {
        const isVisible = this.cartModal.classList.contains('show');
        
        if (isVisible) {
            this.cartModal.classList.remove('show');
        } else {
            this.cartModal.classList.add('show');
            this.cart.render();
        }
    }
}

// Classe principal da loja
class TechStore {
    constructor() {
        this.productCatalog = new ProductCatalog();
        this.cart = new Cart();
        this.ui = new StoreUI(this.productCatalog, this.cart);
    }

    // Inicializa a loja
    init() {
        this.ui.init();
    }

    // Métodos públicos para serem chamados globalmente
    filterProducts(category, element) {
        this.ui.filterProducts(category, element);
    }

    toggleCart() {
        this.ui.toggleCart();
    }

    checkout() {
        this.cart.checkout();
    }
}

// Instância global da loja
const store = new TechStore();

// Funções globais para compatibilidade com HTML existente
function filterProducts(category, element) {
    store.filterProducts(category, element);
}

function toggleCart() {
    store.toggleCart();
}

function checkout() {
    store.checkout();
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    store.init();
});