document.addEventListener('DOMContentLoaded', async () =>{
    const url = window.location.origin + '/api/carts/'+ document.cartId

    const updateProductQuantity = async (event) => {
        const quantity = event.target.value
        const pid = event.target.parentNode.parentNode.parentNode.parentNode.id
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
            console.log(item)
            const d = document.createElement('div')
            d.classList.add(['card'])
            d.innerHTML = `
            <div class="card-header">
                <b> ${item.product.title}</b>
            </div>`
            if (item.product.thumbnails.length) {
                d.innerHTML += `<img src="${item.product.thumbnails[0]}" class="card-img-top">`
            }
            const body = document.createElement('div')
            body.classList.add(['card-body'])
            body.innerHTML = `
            <p><b>Título: </b> ${item.product.title}</p>
            <p name='description'><b>Descripción: </b></p>
            <p>${item.product.description}</p>
            <p ><b>Precio: </b>${item.product.price}</p>
            <div class='row'>
                <label for='${item._id}' class='col-6 col-form-label'><b>Cantidad: </b></label>
            <div class='col-6' name='quantity'></div>
            </div>`
            
            const q = document.createElement('input')
            q.classList.add('form-control')
            q.id = item._id
            q.type = 'number'
            q.value = item.quantity
            q.oldValue = item.quantity
            q.addEventListener('change', updateProductQuantity)

            body.querySelector('[name=quantity]').append(q)
            
            d.id = item.product._id
            d.appendChild(body)
            const c = document.createElement('div')
            c.classList.add('col')
            c.appendChild(d)
            productsDiv.appendChild(c)
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