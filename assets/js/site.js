(() => {
    const storageKeys = {
        products: "localstore.products.v1",
        categories: "localstore.categories.v1",
        cart: "localstore.cart.v1",
        orders: "localstore.orders.v1"
    };

    const initialProducts = [
        { id: "snack-cheetos", name: "Cheetos", category: "Snacks", description: "Crunchy cheese-flavored snack.", price: 2.49, stock: 20, image: "cheetos.jpg" },
        { id: "snack-doritos", name: "Doritos", category: "Snacks", description: "Crispy, savory tortilla chips.", price: 2.49, stock: 20, image: "doritos.jpg" },
        { id: "snack-lays", name: "Lay's", category: "Snacks", description: "Classic thin and crispy potato chips.", price: 2.29, stock: 20, image: "lays.png" },
        { id: "snack-piattos", name: "Piattos", category: "Snacks", description: "Crispy potato crisps with a savory flavor.", price: 1.99, stock: 20, image: "piattos.png" },
        { id: "snack-pringles", name: "Pringles", category: "Snacks", description: "Stackable, seasoned potato crisps.", price: 2.99, stock: 20, image: "pringles.jpg" },
        { id: "snack-ruffles", name: "Ruffles", category: "Snacks", description: "Ridged potato chips with a satisfying crunch.", price: 2.49, stock: 20, image: "ruffles.webp" },
        { id: "drink-coke", name: "Coca-Cola", category: "Drinks", description: "A chilled, refreshing cola.", price: 1.79, stock: 20, image: "coca-cola.jpg" },
        { id: "drink-sprite", name: "Sprite", category: "Drinks", description: "A crisp lemon-lime soft drink.", price: 1.79, stock: 20, image: "sprite.jpg" },
        { id: "drink-monster", name: "Monster Energy", category: "Drinks", description: "Energy drink served chilled.", price: 3.49, stock: 20, image: "monster.jpg" },
        { id: "drink-redbull", name: "Red Bull", category: "Drinks", description: "Energy drink served chilled.", price: 3.49, stock: 20, image: "redbull.jpeg" },
        { id: "meal-burritos", name: "Burritos", category: "Meals", description: "A quick, filling grab-and-go meal.", price: 4.99, stock: 12, image: "burritos.webp" },
        { id: "meal-sandwich", name: "Sandwich", category: "Meals", description: "A freshly prepared convenience-store sandwich.", price: 5.49, stock: 12, image: "sandwich.jpg" },
        { id: "meal-cobb", name: "Cobb Salad", category: "Meals", description: "A hearty salad for a lighter meal.", price: 6.49, stock: 10, image: "cobb.jpg" },
        { id: "treat-cheese", name: "Cheese Snack", category: "Snacks", description: "A convenient savory cheese snack.", price: 2.29, stock: 16, image: "cheese.jpg" },
        { id: "treat-cinnamon", name: "Cinnamon Roll", category: "Meals", description: "A sweet cinnamon treat.", price: 2.99, stock: 10, image: "cinnamon.jpg" },
        { id: "treat-slurpee", name: "Slurpee", category: "Drinks", description: "An icy frozen drink.", price: 2.49, stock: 20, image: "slurpees.jpg" }
    ];

    const initialCategories = [
        { name: "Snacks", description: "Chips and savory snacks." },
        { name: "Drinks", description: "Cold drinks and refreshments." },
        { name: "Meals", description: "Quick meals and ready-to-eat food." }
    ];

    const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    const readStore = (key, fallback) => {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    };

    const writeStore = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Could not save this demo data in browser storage.", error);
            window.alert("The browser could not save this demo data. Check your browser storage settings and try again.");
            throw error;
        }
    };

    const products = () => readStore(storageKeys.products, initialProducts);
    const categories = () => readStore(storageKeys.categories, initialCategories);
    const cart = () => readStore(storageKeys.cart, []);
    const orders = () => readStore(storageKeys.orders, []);
    const money = (amount) => `$${Number(amount || 0).toFixed(2)}`;
    const productImage = (image) => {
        const value = String(image || "").trim();
        if (/^https:\/\//i.test(value)) return escapeHtml(value);
        const filename = value.replace(/^.*[\\/]/, "");
        return `../assets/images/${encodeURIComponent(filename)}`;
    };

    const rootPrefix = () => document.body.dataset.page === "home" ? "" : "../";
    const pageLink = (filename) => `${rootPrefix()}pages/${filename}.html`;
    const totalItems = () => cart().reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = () => cart().reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    function renderHeader() {
        const host = document.getElementById("site-header");
        if (!host) return;
        const root = rootPrefix();
        host.innerHTML = `
            <header class="shadow-sm">
                <nav class="navbar navbar-expand-lg navbar-light bg-light site-nav">
                    <div class="container">
                        <a class="navbar-brand" href="${root}index.html"><img src="${root}assets/images/7-eleven.jpg" alt="7-Eleven" class="logo-img"></a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNavbar" aria-controls="siteNavbar" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="siteNavbar">
                            <ul class="navbar-nav me-auto">
                                <li class="nav-item"><a class="nav-link" href="${root}index.html">Home</a></li>
                                <li class="nav-item"><a class="nav-link" href="${pageLink("shop")}">Shop</a></li>
                                <li class="nav-item"><a class="nav-link" href="${pageLink("categories")}">Categories</a></li>
                                <li class="nav-item"><a class="nav-link" href="${pageLink("cart")}">Cart <span class="badge text-bg-success" data-cart-count>${totalItems()}</span></a></li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Demo tools</a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="${pageLink("inventory")}">Inventory</a></li>
                                        <li><a class="dropdown-item" href="${pageLink("add_inventory")}">Add product</a></li>
                                        <li><a class="dropdown-item" href="${pageLink("add_category")}">Add category</a></li>
                                        <li><a class="dropdown-item" href="${pageLink("sales_report")}">Sales report</a></li>
                                    </ul>
                                </li>
                            </ul>
                            <form class="d-flex" data-search-form role="search">
                                <input class="form-control me-2" type="search" name="query" placeholder="Search products..." aria-label="Search products">
                                <button class="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
                ${document.body.dataset.page === "home" ? `
                    <div class="hero text-center">
                        <h1>Welcome to 7-Eleven</h1>
                        <p>Your convenience store, always nearby.</p>
                        <div class="buttons">
                            <a href="${pageLink("shop")}" class="btn">Start shopping</a>
                            <a href="${pageLink("join")}" class="btn">About this demo</a>
                        </div>
                    </div>
                ` : ""}
            </header>`;
    }

    function renderFooter() {
        const host = document.getElementById("site-footer");
        if (!host) return;
        host.innerHTML = `
            <footer class="py-4 mt-5 border-top text-white">
                <div class="container text-center">
                    <p class="mb-1">Static website demo. Orders and changes are saved only in this browser.</p>
                    <small class="text-white-50">No account, payment, or server-side order processing is connected.</small>
                </div>
            </footer>`;
    }

    function productCard(product) {
        return `
            <div class="product-item col-md-4 mb-4">
                <div class="card h-100">
                    <div class="image-container"><img src="${productImage(product.image)}" alt="${escapeHtml(product.name)}" class="card-img-top" loading="lazy"></div>
                    <div class="card-body">
                        <h3 class="card-title">${escapeHtml(product.name)}</h3>
                        <p class="card-text description">${escapeHtml(product.description)}</p>
                        <p class="card-text price">${money(product.price)}</p>
                        <p class="card-text category">${escapeHtml(product.category)}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between product-buttons">
                        <button type="button" class="btn btn-primary" data-action="add-cart" data-id="${escapeHtml(product.id)}">Add to cart</button>
                        <a class="btn btn-success" href="${pageLink("checkout")}?buyNow=${encodeURIComponent(product.id)}">Buy now</a>
                    </div>
                </div>
            </div>`;
    }

    function renderProducts(items, heading) {
        const host = document.getElementById("page-content");
        host.innerHTML = `
            <section class="shop container mt-5">
                <h2 class="text-center mb-4">${escapeHtml(heading)}</h2>
                <div class="mb-4">
                    <label class="form-label" for="category-filter">Filter by category</label>
                    <select class="form-select" id="category-filter">
                        <option value="">All categories</option>
                        ${categories().map((category) => `<option value="${escapeHtml(category.name)}">${escapeHtml(category.name)}</option>`).join("")}
                    </select>
                </div>
                <div class="product-list row">${items.length ? items.map(productCard).join("") : '<p class="text-center">No products match your search.</p>'}</div>
                <p class="small text-muted">Product catalog and cart are demo data stored in this browser.</p>
            </section>`;
        const select = document.getElementById("category-filter");
        const selectedCategory = new URLSearchParams(location.search).get("category") || "";
        select.value = selectedCategory;
        select.addEventListener("change", () => {
            const query = select.value ? `?category=${encodeURIComponent(select.value)}` : "";
            location.href = `${pageLink("shop")}${query}`;
        });
    }

    function renderShop() {
        const params = new URLSearchParams(location.search);
        const category = params.get("category") || "";
        const query = (params.get("query") || "").trim().toLowerCase();
        const matches = products().filter((product) => {
            const categoryMatch = !category || product.category === category;
            const searchMatch = !query || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
            return categoryMatch && searchMatch;
        });
        renderProducts(matches, category ? `${category} Products` : query ? `Search Results for "${query}"` : "Our Products");
    }

    function renderCart() {
        const items = cart();
        const host = document.getElementById("page-content");
        host.innerHTML = `
            <section class="cart container">
                <h2>Your Shopping Cart</h2>
                <div class="cart-items">
                    ${items.length ? items.map((item) => `
                        <article class="cart-item">
                            <div class="image-container"><img src="${productImage(item.image)}" alt="${escapeHtml(item.name)}"></div>
                            <div class="cart-item-info">
                                <h3>${escapeHtml(item.name)}</h3>
                                <p class="price">Price: ${money(item.price)}</p>
                                <label>Quantity
                                    <input class="form-control" type="number" min="1" max="99" value="${item.quantity}" data-quantity="${escapeHtml(item.id)}" aria-label="Quantity for ${escapeHtml(item.name)}">
                                </label>
                                <p class="subtotal">Subtotal: ${money(item.price * item.quantity)}</p>
                            </div>
                            <button type="button" class="cart-btn remove-btn" data-action="remove-cart" data-id="${escapeHtml(item.id)}">Remove</button>
                        </article>`).join("") : '<p class="empty-cart">Your cart is empty. Start shopping now!</p>'}
                </div>
                ${items.length ? `
                    <div class="cart-summary">
                        <div class="total-section"><h3>Total: ${money(cartTotal())}</h3></div>
                        <div class="summary-buttons">
                            <a class="cart-btn checkout-btn" href="${pageLink("checkout")}">Continue to demo checkout</a>
                            <a class="cart-btn continue-shopping-btn" href="${pageLink("shop")}">Continue shopping</a>
                            <button type="button" class="cart-btn empty-cart-btn" data-action="clear-cart">Clear cart</button>
                        </div>
                    </div>` : `<a class="btn btn-primary" href="${pageLink("shop")}">Browse products</a>`}
                <p class="small text-muted mt-3">Demo only: cart contents stay in this browser and are not sent to a store.</p>
            </section>`;
        host.querySelectorAll("[data-quantity]").forEach((input) => input.addEventListener("change", () => {
            const next = cart().map((item) => item.id === input.dataset.quantity
                ? { ...item, quantity: Math.max(1, Math.min(99, Number.parseInt(input.value, 10) || 1)) }
                : item);
            writeStore(storageKeys.cart, next);
            renderCart();
            updateCartCount();
        }));
    }

    function checkoutItems() {
        const buyNow = new URLSearchParams(location.search).get("buyNow");
        if (!buyNow) return cart();
        const product = products().find((item) => item.id === buyNow);
        return product ? [{ ...product, quantity: 1 }] : [];
    }

    function renderCheckout() {
        const items = checkoutItems();
        const host = document.getElementById("page-content");
        if (!items.length) {
            host.innerHTML = `<section class="container mt-5 text-center"><h1>Your cart is empty</h1><a class="btn btn-primary" href="${pageLink("shop")}">Browse products</a></section>`;
            return;
        }
        const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        host.innerHTML = `
            <section class="checkout container mt-5">
                <h1>Demo checkout</h1>
                <div class="alert alert-warning">Frontend-only demo: do not enter personal or payment information. This creates a sample order saved only in this browser; no payment is taken.</div>
                <div class="checkout-summary mb-4">
                    <h2>Order summary</h2>
                    <ul>${items.map((item) => `<li>${escapeHtml(item.name)} × ${item.quantity} — ${money(item.price * item.quantity)}</li>`).join("")}</ul>
                    <strong>Total: ${money(total)}</strong>
                </div>
                <form id="checkout-form" class="checkout-form">
                    <div class="form-group mb-3"><label for="payment-method">Demo payment method</label>
                        <select id="payment-method" name="payment" class="form-select" required>
                            <option value="">Choose a demo option</option><option>Cash on delivery (demo)</option><option>GCash (not connected)</option>
                        </select>
                    </div>
                    <button class="btn btn-success" type="submit">Place demo order</button>
                    <a class="btn btn-outline-secondary" href="${pageLink("cart")}">Back to cart</a>
                </form>
            </section>`;
        document.getElementById("checkout-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (!form.reportValidity()) return;
            const formData = new FormData(form);
            const order = {
                id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
                payment: String(formData.get("payment")),
                items,
                total,
                createdAt: new Date().toISOString()
            };
            const savedOrders = orders();
            savedOrders.unshift(order);
            writeStore(storageKeys.orders, savedOrders);
            if (!new URLSearchParams(location.search).has("buyNow")) {
                writeStore(storageKeys.cart, []);
            }
            location.href = `${pageLink("checkout_success")}?order=${encodeURIComponent(order.id)}`;
        });
    }

    function renderSuccess() {
        const id = new URLSearchParams(location.search).get("order");
        const order = orders().find((item) => item.id === id) || orders()[0];
        document.getElementById("page-content").innerHTML = order ? `
            <section class="order-success container text-center mt-5">
                <h1>Demo order saved</h1>
                <p>This sample order is stored only in this browser. No store received it and no payment was processed.</p>
                <p>Reference: <strong>${escapeHtml(order.id)}</strong></p>
                <p>Demo total: <strong>${money(order.total)}</strong></p>
                <a class="btn btn-primary" href="${pageLink("shop")}">Back to shopping</a>
            </section>` : `
            <section class="container text-center mt-5">
                <h1>No demo order found</h1><p>Orders are stored locally in the browser that created them.</p>
                <a class="btn btn-primary" href="${pageLink("shop")}">Browse products</a>
            </section>`;
    }

    function renderCategories() {
        const host = document.getElementById("page-content");
        host.innerHTML = `
            <section class="categories container mt-5">
                <h1>Product categories</h1>
                <div class="category-list">
                    ${categories().map((category) => `
                        <article class="category-item">
                            <h2>${escapeHtml(category.name)}</h2>
                            <p>${escapeHtml(category.description)}</p>
                            <a class="view-products" href="${pageLink("shop")}?category=${encodeURIComponent(category.name)}">View products <i class="fas fa-arrow-right"></i></a>
                        </article>`).join("")}
                </div>
                <p class="small text-muted">Categories are sample data stored only in this browser.</p>
            </section>`;
    }

    function renderInventory() {
        const host = document.getElementById("page-content");
        host.innerHTML = `
            <section class="inventory container mt-5">
                <h1>Demo inventory</h1>
                <div class="alert alert-warning">These inventory edits are saved only in this browser. They do not update a store or database.</div>
                <p><a class="btn btn-primary" href="${pageLink("add_inventory")}">Add demo product</a> <a class="btn btn-outline-primary" href="${pageLink("add_category")}">Manage categories</a></p>
                <div class="inventory-list">
                    ${products().map((product) => `
                        <article class="inventory-item">
                            <div class="image-container"><img src="${productImage(product.image)}" alt="${escapeHtml(product.name)}" class="inventory-image"></div>
                            <h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.description)}</p>
                            <p>Price: ${money(product.price)} · Stock: ${Number(product.stock) || 0} · Category: ${escapeHtml(product.category)}</p>
                            <div class="inventory-actions">
                                <a class="edit-button" href="${pageLink("edit_inventory")}?id=${encodeURIComponent(product.id)}">Edit</a>
                                <button class="delete-button" type="button" data-action="delete-product" data-id="${escapeHtml(product.id)}">Delete</button>
                            </div>
                        </article>`).join("")}
                </div>
            </section>`;
    }

    function renderProductForm(editing) {
        const id = new URLSearchParams(location.search).get("id");
        const existing = editing ? products().find((item) => item.id === id) : null;
        const host = document.getElementById("page-content");
        if (editing && !existing) {
            host.innerHTML = `<section class="container mt-5"><h1>Product not found</h1><a href="${pageLink("inventory")}">Return to inventory</a></section>`;
            return;
        }
        host.innerHTML = `
            <section class="container mt-5">
                <h1>${editing ? "Edit demo product" : "Add demo product"}</h1>
                <div class="alert alert-warning">Changes are saved in this browser only.</div>
                <form id="product-form" class="form-card">
                    <div class="form-group mb-3"><label for="product-name">Name</label><input id="product-name" name="name" class="form-control" value="${escapeHtml(existing?.name || "")}" required></div>
                    <div class="form-group mb-3"><label for="product-description">Description</label><textarea id="product-description" name="description" class="form-control" required>${escapeHtml(existing?.description || "")}</textarea></div>
                    <div class="form-group mb-3"><label for="product-price">Price</label><input id="product-price" name="price" class="form-control" type="number" min="0" step="0.01" value="${escapeHtml(existing?.price ?? "")}" required></div>
                    <div class="form-group mb-3"><label for="product-stock">Stock</label><input id="product-stock" name="stock" class="form-control" type="number" min="0" step="1" value="${escapeHtml(existing?.stock ?? 0)}" required></div>
                    <div class="form-group mb-3"><label for="product-category">Category</label><select id="product-category" name="category" class="form-select" required>
                        ${categories().map((category) => `<option value="${escapeHtml(category.name)}" ${existing?.category === category.name ? "selected" : ""}>${escapeHtml(category.name)}</option>`).join("")}
                    </select></div>
                    <div class="form-group mb-3"><label for="product-image">Image filename</label><input id="product-image" name="image" class="form-control" value="${escapeHtml(existing?.image || "cheese.jpg")}" required><small>Use an image filename from the assets/images folder.</small></div>
                    <button class="btn btn-success" type="submit">Save demo product</button>
                    <a class="btn btn-outline-secondary" href="${pageLink("inventory")}">Cancel</a>
                </form>
            </section>`;
        document.getElementById("product-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (!form.reportValidity()) return;
            const data = new FormData(form);
            const allProducts = products();
            const product = {
                id: existing?.id || `custom-${Date.now().toString(36)}`,
                name: String(data.get("name")).trim(),
                description: String(data.get("description")).trim(),
                price: Number(data.get("price")),
                stock: Number(data.get("stock")),
                category: String(data.get("category")),
                image: String(data.get("image")).trim().replace(/^.*[\\/]/, "")
            };
            const updated = editing
                ? allProducts.map((item) => item.id === product.id ? product : item)
                : [...allProducts, product];
            writeStore(storageKeys.products, updated);
            location.href = pageLink("inventory");
        });
    }

    function renderAddCategory() {
        const host = document.getElementById("page-content");
        host.innerHTML = `
            <section class="container mt-5">
                <h1>Demo categories</h1>
                <div class="alert alert-warning">Categories are stored in this browser only and are not shared with other visitors.</div>
                <form id="category-form" class="form-card mb-4">
                    <div class="form-group mb-3"><label for="category-name">Category name</label><input id="category-name" name="name" class="form-control" required></div>
                    <div class="form-group mb-3"><label for="category-description">Description</label><textarea id="category-description" name="description" class="form-control" required></textarea></div>
                    <button class="btn btn-success" type="submit">Add category</button>
                </form>
                <ul class="list-group">${categories().map((category) => `<li class="list-group-item"><strong>${escapeHtml(category.name)}</strong> — ${escapeHtml(category.description)}</li>`).join("")}</ul>
            </section>`;
        document.getElementById("category-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (!form.reportValidity()) return;
            const data = new FormData(form);
            const name = String(data.get("name")).trim();
            const savedCategories = categories();
            if (savedCategories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
                window.alert("That category already exists.");
                return;
            }
            savedCategories.push({ name, description: String(data.get("description")).trim() });
            writeStore(storageKeys.categories, savedCategories);
            renderAddCategory();
        });
    }

    function renderSalesReport() {
        const savedOrders = orders();
        const totalSales = savedOrders.reduce((sum, order) => sum + Number(order.total), 0);
        const host = document.getElementById("page-content");
        host.innerHTML = `
            <section class="container mt-5">
                <h1>Demo sales report</h1>
                <div class="alert alert-warning">This report includes only sample orders saved in this browser. It is not business or accounting data.</div>
                <div class="row g-3 mb-4">
                    <div class="col-md-4"><div class="card card-body"><strong>Demo orders</strong><span>${savedOrders.length}</span></div></div>
                    <div class="col-md-4"><div class="card card-body"><strong>Demo sales total</strong><span>${money(totalSales)}</span></div></div>
                    <div class="col-md-4"><div class="card card-body"><strong>Average order</strong><span>${money(savedOrders.length ? totalSales / savedOrders.length : 0)}</span></div></div>
                </div>
                <div class="table-responsive"><table class="table sales-table">
                    <thead><tr><th>Reference</th><th>Date</th><th>Items</th><th>Total</th></tr></thead>
                    <tbody>${savedOrders.length ? savedOrders.map((order) => `<tr><td>${escapeHtml(order.id)}</td><td>${escapeHtml(new Date(order.createdAt).toLocaleString())}</td><td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td>${money(order.total)}</td></tr>`).join("") : '<tr><td colspan="4">No demo orders have been placed in this browser.</td></tr>'}</tbody>
                </table></div>
            </section>`;
    }

    function renderJoin() {
        document.getElementById("page-content").innerHTML = `
            <section class="container mt-5">
                <div class="join-container">
                    <h1>About this website</h1>
                    <p>This is a static frontend demo. It does not create accounts, accept payments, or send orders to a store.</p>
                    <p>Shopping cart, demo orders, and inventory changes are kept in your current browser only. To publish a real shop with shared products and orders, connect a secure backend and payment provider.</p>
                    <a class="btn btn-primary" href="${pageLink("shop")}">Browse demo products</a>
                </div>
            </section>`;
    }

    function updateCartCount() {
        document.querySelectorAll("[data-cart-count]").forEach((badge) => {
            badge.textContent = String(totalItems());
        });
    }

    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        const id = button.dataset.id;
        const action = button.dataset.action;
        if (action === "add-cart") {
            const product = products().find((item) => item.id === id);
            if (!product) return;
            const items = cart();
            const existing = items.find((item) => item.id === id);
            if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
            else items.push({ ...product, quantity: 1 });
            writeStore(storageKeys.cart, items);
            updateCartCount();
            button.textContent = "Added";
            window.setTimeout(() => { if (button.isConnected) button.textContent = "Add to cart"; }, 1200);
        } else if (action === "remove-cart") {
            writeStore(storageKeys.cart, cart().filter((item) => item.id !== id));
            renderCart();
            updateCartCount();
        } else if (action === "clear-cart") {
            writeStore(storageKeys.cart, []);
            renderCart();
            updateCartCount();
        } else if (action === "delete-product") {
            if (!window.confirm("Delete this demo product from this browser?")) return;
            writeStore(storageKeys.products, products().filter((item) => item.id !== id));
            renderInventory();
        }
    });

    document.addEventListener("submit", (event) => {
        const form = event.target.closest("[data-search-form]");
        if (!form) return;
        event.preventDefault();
        const query = new FormData(form).get("query").toString().trim();
        location.href = `${pageLink("searchbar")}?query=${encodeURIComponent(query)}`;
    });

    renderHeader();
    renderFooter();
    const page = document.body.dataset.page;
    const pageRenderers = {
        shop: renderShop,
        search: renderShop,
        cart: renderCart,
        checkout: renderCheckout,
        "checkout-success": renderSuccess,
        categories: renderCategories,
        inventory: renderInventory,
        "add-inventory": () => renderProductForm(false),
        "edit-inventory": () => renderProductForm(true),
        "add-category": renderAddCategory,
        "sales-report": renderSalesReport,
        join: renderJoin
    };
    if (pageRenderers[page]) pageRenderers[page]();
})();
