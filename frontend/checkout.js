const checkoutItems =
    document.getElementById("checkout-items");

const checkoutTotal =
    document.getElementById("checkout-total");


const cart =
    JSON.parse(localStorage.getItem("cart")) || [];


function displayCheckout() {

    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";

        checkoutTotal.innerHTML = "";

        return;
    }


    checkoutItems.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        const itemElement =
            document.createElement("div");

        itemElement.className =
            "checkout-item";


        itemElement.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <p>
                    Quantity: ${item.quantity}
                </p>

            </div>

            <strong>
                ₹${itemTotal}
            </strong>

        `;


        checkoutItems.appendChild(itemElement);

    });


    checkoutTotal.innerHTML = `

        <hr>

        <h3>
            Total: ₹${total}
        </h3>

    `;
}


displayCheckout();
const addressForm =
    document.getElementById("address-form");


addressForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const address = {

        name:
            document.getElementById("name").value,

        phone:
            document.getElementById("phone").value,

        house:
            document.getElementById("house").value,

        building:
            document.getElementById("building").value,

        area:
            document.getElementById("area").value,

        street:
            document.getElementById("street").value,

        landmark:
            document.getElementById("landmark").value,

        city:
            document.getElementById("city").value,

        state:
            document.getElementById("state").value,

        pincode:
            document.getElementById("pincode").value,

        type:
            document.querySelector(
                'input[name="address-type"]:checked'
            ).value

    };


    localStorage.setItem(
        "deliveryAddress",
        JSON.stringify(address)
    );


    alert("Address saved successfully!");

});