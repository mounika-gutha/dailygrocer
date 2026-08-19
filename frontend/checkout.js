const checkoutItems =
    document.getElementById("checkout-items");

const checkoutTotal =
    document.getElementById("checkout-total");


const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


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
                    ${item.unit}
                </p>

                <p>
                    Quantity: ${item.quantity}
                </p>

            </div>

            <strong>
                ₹${itemTotal}
            </strong>

        `;


        checkoutItems.appendChild(
            itemElement
        );

    });


    checkoutTotal.innerHTML = `

        <hr>

        <h3>
            Total: ₹${total}
        </h3>

    `;

}


displayCheckout();


/* =========================
   SAVE ADDRESS
========================= */

const addressForm =
    document.getElementById(
        "address-form"
    );


if (addressForm) {

    addressForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const selectedType =
                document.querySelector(
                    'input[name="address-type"]:checked'
                );


            const address = {

                name:
                    document.getElementById(
                        "name"
                    ).value,

                phone:
                    document.getElementById(
                        "phone"
                    ).value,

                house:
                    document.getElementById(
                        "house"
                    ).value,

                building:
                    document.getElementById(
                        "building"
                    ).value,

                area:
                    document.getElementById(
                        "area"
                    ).value,

                street:
                    document.getElementById(
                        "street"
                    ).value,

                landmark:
                    document.getElementById(
                        "landmark"
                    ).value,

                city:
                    document.getElementById(
                        "city"
                    ).value,

                state:
                    document.getElementById(
                        "state"
                    ).value,

                pincode:
                    document.getElementById(
                        "pincode"
                    ).value,

                type:
                    selectedType
                        ? selectedType.value
                        : "Home"

            };


            localStorage.setItem(
                "deliveryAddress",
                JSON.stringify(address)
            );


            alert(
                "Address saved successfully!"
            );

        }
    );

}
/* =========================
   PLACE ORDER
========================= */

function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    const address =
        JSON.parse(
            localStorage.getItem("deliveryAddress")
        );


    if (!address) {

        alert(
            "Please save your delivery address first."
        );

        return;
    }


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    let paymentMethod =
        "Cash on Delivery";

    let paymentStatus =
        "Pending";


    if (payment) {

        if (payment.value === "upi") {

            paymentMethod = "UPI";

            // Dummy payment
            paymentStatus = "Paid";

        } else if (payment.value === "card") {

            paymentMethod = "Card";

            // Dummy payment
            paymentStatus = "Paid";

        }

    }


    const orderTotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    const order = {

        orderId:
            "DG" +
            Date.now(),

        items: cart,

        address: address,

        paymentMethod:
            paymentMethod,

        paymentStatus:
            paymentStatus,

        orderStatus:
            "Confirmed",

        total:
            orderTotal,

        orderDate:
            new Date().toLocaleString()

    };


    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    // Clear cart

    localStorage.removeItem("cart");


    // Show confirmation

    alert(
        "Order placed successfully! 🎉\n\n" +
        "Order ID: " +
        order.orderId
    );


    window.location.href =
        "index.html";

}