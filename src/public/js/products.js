getProducts = async (url) => {
    console.log(url)
    const response = await fetch(url)
    const data = await response.json();
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = ''
    data.payload.forEach((product)=>{
        const d = document.createElement('div')
        d.innerHTML = `<p><b>Título: </b> ${product.title}</p>
        <p><b>Descripción: </b></p>
        <p>${product.description}</p>
        <p><b>Precio: </b>${product.price}</p>
        <p><b>Código: </b>${product.code}</p>
        <p><b>Categoría: </b>${product.category}</p>
        <p><b>Stock: </b>${product.stock}</p>
        `
        const addUrl = window.location.origin + '/api/carts/' + document.cartId + '/product/' + product._id
        const b = document.createElement('button', {type: 'button'})
        b.type = 'button'
        b.innerHTML = 'Agregar al carrito'
        b.onclick = async () => {
            console.log(addUrl)
            const res = await fetch(addUrl, {method:'POST'})
            const data = await res.json()
            console.log(data)
        }
        d.appendChild(b)
        d.appendChild(document.createElement('hr'))
        productsDiv.appendChild(d)
    });
    
    const prevPageButton = document.getElementById('prevPageButton');
    const nextPageButton = document.getElementById('nextPageButton');
    if (data.hasPrevPage) {
        prevPageButton.onclick = async () =>{
            await getProducts(data.prevLink)
        }
        prevPageButton.disabled = false
    } else {
        prevPageButton.disabled = true
        prevPageButton.onclick = () =>{}
    }
    if (data.hasNextPage) {
        nextPageButton.onclick = async () => {
            await getProducts(data.nextLink)
        }
        nextPageButton.disabled = false
    } else {
        nextPageButton.disabled = true
        nextPageButton.onclick = () =>{}
    }
}



document.addEventListener('DOMContentLoaded', async () =>{
    document.getElementById('logoutButton').onclick = async () => {
        const response = await fetch('/api/sessions/logout' , {
            method: 'DELETE',
            redirect: 'follow'
        })
        console.log(response)
        if (response.redirected) {
            window.location.href = response.url;
        }
    }

    let params = {
        limit: 3,
        page: 1,
        sort: 'asc'
    }
    const url = window.location.origin + '/api/products/?'+ new URLSearchParams(params).toString()
    await getProducts(url)
})