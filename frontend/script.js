const productsContainer =
    document.getElementById("products-container");

const cartCount =
    document.getElementById("cart-count");


let cart = 0;


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
                    onclick="addToCart()"
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


function addToCart() {

    cart++;

    cartCount.textContent = cart;

}


loadProducts();