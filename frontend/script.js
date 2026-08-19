const productsContainer =
    document.getElementById("products-container");

const cartCount =
    document.getElementById("cart-count");

const cartItems =
    document.getElementById("cart-items");

let cart = [];


/* LOAD PRODUCTS */

async function loadProducts() {

    try {

        const response = await fetch(
            "https://dailygrocer-otui.onrender.com/api/products"
        );

        if (!response.ok) {
            throw new Error("Could not load products");
        }

        const products = await response.json();

        productsContainer.innerHTML = "";


        products.forEach(product => {

            const card =
                document.createElement("div");

            card.className = "product-card";


            let options = "";

            product.options.forEach(
                (option, index) => {

                    options += `
                        <option value="${index}">
                            ${option.label} - ₹${option.price}
                        </option>
                    `;

                }
            );


            card.innerHTML = `

                <h3>${product.name}</h3>

                <p class="category">
                    ${product.category}
                </p>

                <label>
                    Choose quantity:
                </label>

                <select
                    id="option-${product.id}"
                    class="quantity-select"
                >
                    ${options}
                </select>

                <p
                    id="price-${product.id}"
                    class="price"
                >
                    ₹${product.options[0].price}
                </p>

                <button
                    class="add-button"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            `;


            productsContainer.appendChild(card);


            const select =
                document.getElementById(
                    `option-${product.id}`
                );

            const price =
                document.getElementById(
                    `price-${product.id}`
                );


            select.addEventListener(
                "change",
                function () {

                    const selected =
                        product.options[
                            this.value
                        ];

                    price.textContent =
                        `₹${selected.price}`;

                }
            );

        });


    } catch (error) {

        console.error(error);

        productsContainer.innerHTML = `
            <p>
                Unable to load products.
            </p>
        `;

    }
}


/* ADD TO CART */

async function addToCart(productId) {

    const response = await fetch(
        "https://dailygrocer-otui.onrender.com/api/products"
    );

    const products = await response.json();


    const product =
        products.find(
            item => item.id === productId
        );


    const select =
        document.getElementById(
            `option-${productId}`
        );


    const selectedOption =
        product.options[
            select.value
        ];


    const existing =
        cart.find(
            item =>
                item.id === productId &&
                item.unit === selectedOption.label
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            unit: selectedOption.label,

            price: selectedOption.price,

            quantity: 1

        });

    }


    updateCart();

}


/* UPDATE CART */

function updateCart() {

    let count = 0;

    let total = 0;


    cart.forEach(item => {

        count += item.quantity;

        total +=
            item.price *
            item.quantity;

    });


    cartCount.textContent = count;


    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        return;

    }


    cart.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "cart-item";


        div.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <p>
                    ${item.unit}
                </p>

                <p>
                    Quantity: ${item.quantity}
                </p>

                <p>
                    ₹${item.price * item.quantity}
                </p>

            </div>

            <button
                onclick="
                    removeFromCart(
                        ${item.id},
                        '${item.unit}'
                    )
                "
            >
                Remove
            </button>

        `;


        cartItems.appendChild(div);

    });


    const totalElement =
        document.createElement("h3");


    totalElement.textContent =
        `Total: ₹${total}`;


    cartItems.appendChild(
        totalElement
    );

}


/* REMOVE FROM CART */

function removeFromCart(
    productId,
    unit
) {

    const item =
        cart.find(
            product =>
                product.id === productId &&
                product.unit === unit
        );


    if (!item) {
        return;
    }


    item.quantity--;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    !(
                        product.id === productId &&
                        product.unit === unit
                    )
            );

    }


    updateCart();

}


/* OPEN CART */

function openCart() {

    const cartSection =
        document.getElementById(
            "cart-section"
        );


    if (cartSection) {

        cartSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* CHECKOUT */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    window.location.href =
        "checkout.html";

}


/* START */

loadProducts();