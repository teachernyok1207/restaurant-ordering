// Initializing imports
import { menuArray } from "./data.js"

// Calling Elements by ID
const orderedProducts = document.getElementById("ordered-products")
const checkoutButton = document.getElementById("checkout-button")
const paymentDiv = document.getElementById("payment-div")
const paymentButton = document.getElementById("payment-button")
const cancelButton = document.getElementById("cancel-button")
const noOrderDiv = document.getElementById("no-order-div")
const closeNoOrderButton = document.getElementById("close-no-order-button")
const closeConfirmedButton = document.getElementById("close-confirmed-button")
const orderConfirmedDiv = document.getElementById("order-confirmed-div")

// Variable for Receiving Total Price
let totalPrice = 0
let orderList = []

// Rendering All Products
function renderProducts(){
    // Calling Elements by ID
    const productList = document.getElementById("product-list")
    const productImg = document.getElementById("product-img")
    const productTitle = document.getElementById("product-title")
    const productDescription = document.getElementById("product-description")
    const productPrice = document.getElementById("product-price")
    const addProduct = document.getElementById("add-product")
    
    menuArray.forEach(function(menu){
        // Displaying Menu on <div>
        productList.innerHTML +=`
            <div class="product-div">
                <div class="product-img-div">
                    <span id="product-img">${menu.emoji}</span>
                </div>
                <div class="product-details-div">
                    <p id="product-title">
                        ${menu.name}
                    </p>
                    <p id="product-description">
                        ${menu.ingredients}
                    </p>
                    <p id="product-price">
                        ${menu.price}
                    </p>
                </div>
                <div id="add-product" data-id="${menu.id}">
                    +
                </div>
            </div>
            <hr>
        `
    })
}

// Render Orders
document.addEventListener("click",function(e){
    try{
        // Clearing Value First
        orderedProducts.innerHTML = ""
        totalPrice = 0
        
        // Checking Dataset
        if (e.target.dataset.id){
            // To Get the ID of the Product
            const currentId = parseInt(e.target.dataset.id)
            const currentOrder = menuArray.filter(function(menu){
                return menu.id === currentId
            })[0]
            
            // Checking if the product is existing in order
            if (orderList.some(orders => orders.id === currentId)){
                // FindIndex of Existing order
                let foundExistingOrder = orderList.findIndex((obj => obj.id === currentId))
                
                // Adding quantity and price to the array value
                orderList[foundExistingOrder].qty ++
                orderList[foundExistingOrder].price += currentOrder.price
            }else{
                // Pushing Menu to New order
                let obj = {}
                obj["id"] = currentId
                obj["name"] = currentOrder.name
                obj["qty"] = 1
                obj["price"] = currentOrder.price
                orderList.push(obj)
            }
        }else if (e.target.dataset.remove){
            // Removing Orders from the OrderList Array
            let selectedOrderId = parseInt(e.target.dataset.remove)
            let selectedOrderIndex = orderList.findIndex((obj => obj.id === selectedOrderId))
            orderList.splice(selectedOrderIndex,1)
        }
        
        // Rendering Orders
        renderOrders()
    }catch{
        // Do Nothing Just to Avoid the Annoying TypeError 😂
    }
})

// Rendering Orders from orderedList Array
function renderOrders(){
    if (orderList.length > 0){
        orderList.forEach(function(orders){
            orderedProducts.innerHTML +=
            `
                <div class="current-order">
                    <p id="checkout-product">${orders.name} x ${orders.qty}</p>
                    <p id="remove-product" data-remove="${orders.id}">remove</p>
                    <p id="checkout-price">${orders.price}</p>
                </div>
            `
            
            // Computing Current Total
            totalPrice += orders.price
        })
    }else{
        orderedProducts.innerHTML = "<h3>(No Orders Yet!)</h3>"
    }
    
    // Rendering Total Amount
    document.getElementById("display-total-price").textContent = `$${totalPrice}`
}

// Display Payment Div
checkoutButton.addEventListener("click",function(){
    // Checking if there are orders
    if (orderList.length > 0){
        paymentDiv.style.display = "block"
        document.getElementById("input-name").focus() //Focus on Enter your Name
    }else{
        noOrderDiv.style.display = "block"
    }
    
    checkoutButton.disabled = true // Disabling Complete Order button
})

// Hide Payment Div
cancelButton.addEventListener("click",function(){
    paymentDiv.style.display = "none"
    checkoutButton.disabled = false // Re-enabling Complete Order button
})

// Show Confirmation Div
paymentButton.addEventListener("click",function(){
    const renderName = document.getElementById("render-name")
    const customerName = document.getElementById("input-name").value
    orderConfirmedDiv.style.display = "block"
    paymentDiv.style.display = "none"
    renderName.textContent = customerName.toUpperCase()
    closeConfirmedButton.focus() //Focus on close button
})

// Hide No Order Div
closeNoOrderButton.addEventListener("click",function(){
    noOrderDiv.style.display = "none"
    checkoutButton.disabled = false // Re-enabling Complete Order button
})

// Hide Confirmed Div
closeConfirmedButton.addEventListener("click",function(){
    orderConfirmedDiv.style.display = "none"
    checkoutButton.disabled = false // Re-enabling Complete Order button
    
    // Clearing text and other variables' values
    document.getElementById("input-name").value = ""
    document.getElementById("input-credit-card").value = ""
    document.getElementById("input-cvv").value = ""
    orderedProducts.innerHTML = ""
    totalPrice = 0
    orderList = []
    
    // Rendering Orders
    renderOrders()
})

// Render Products and Orders
renderProducts(menuArray)
renderOrders()