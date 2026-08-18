const productsContainer =
    document.getElementById("products-container");

const cartCount =
    document.getElementById("cart-count");

const cartItems =
    document.getElementById("cart-items");


let cart = [];


async function loadProducts() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/products"
            );

        const products =
            await response.json();

        productsContainer.innerHTML = "";

        products.forEach(product => {

            const card =
                document.createElement("div");

            card.className =
                "product-card";

            card.innerHTML = `

                <h3>
                    ${product.name}
                </h3>

                <p class="category">
                    ${product.category}
                </p>

                <p class="price">
                    ₹${product.price}
                    / ${product.unit}
                </p>

                <button
                    class="add-button"
                    onclick='addToCart(${JSON.stringify(product)})'
                >
                    Add to Cart
                </button>

            `;

            productsContainer.appendChild(card);

        });

    } catch (error) {

        productsContainer.innerHTML =
            "<p>Unable to load products.</p>";

        console.error(error);
    }
}


function addToCart(product) {

    const existingProduct =
        cart.find(item => item.id === product.id);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}


function updateCart() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent =
        totalItems;


    if (cart.length === 0) {

        cartItems.innerHTML =
            "Your cart is empty.";

        return;
    }


    cartItems.innerHTML = "";


    let totalPrice = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        totalPrice += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <p>
                <strong>${item.name}</strong>
            </p>

            <p>
                Quantity:
                ${item.quantity}
            </p>

            <p>
                ₹${itemTotal}
            </p>

            <button
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    const total =
        document.createElement("h3");

    total.textContent =
        `Total: ₹${totalPrice}`;


    cartItems.appendChild(total);

}


function removeFromCart(productId) {

    const product =
        cart.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    product.quantity--;


    if (product.quantity === 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }


    updateCart();

}


function openCart() {

    document.getElementById("cart-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    alert(
        "Checkout successful! Thank you for your order."
    );

}


loadProducts();