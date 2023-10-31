document.addEventListener('DOMContentLoaded', async () =>{
    const url = window.location.origin + '/api/carts/'+ document.cartId

    const updateProductQuantity = async (event) => {
        const quantity = event.target.value
        const pid = event.target.parentNode.parentNode.id
        const response = await (await fetch(url + `/product/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity
            })
        })).json()
        console.log(response)
        if (response.status == 'Success') {
            event.target.oldValue = event.target.value
        } else {
            event.target.value = event.target.oldValue
        } 
    }

    const getProducts = async () => {
        const response = await fetch(url)
        const data = await response.json();
        const productsDiv = document.getElementById('products');
        productsDiv.innerHTML = ''
        data.products.forEach((item)=>{
            const q = document.createElement('input')
            q.type = 'number'
            q.value = item.quantity
            q.oldValue = item.quantity
            q.addEventListener('change', updateProductQuantity)
            const d = document.createElement('div')
            d.innerHTML = `<p><b>Título: </b> ${item.product.title}</p>
            <p name='description'><b>Descripción: </b></p>
            <p>${item.product.description}</p>
            <p name='price'><b>Precio: </b>${item.product.price}</p>
            <p name='quantity'><b>Cantidad: </b></p>
            <hr>`
            d.querySelector('[name=quantity]').append(q)
            d.id = item.product._id
            productsDiv.appendChild(d)
        });
    }

    const clearProducts = async () => {
        const response = await (await fetch(url, {
            method: 'DELETE'
        })).json()
        if (response.status == 'Success') {
            const productsDiv = document.getElementById('products');
            productsDiv.innerHTML = ''
        }
    }

    document.getElementById('clearProductsButton').addEventListener('click', clearProducts)
    await getProducts(url)
})