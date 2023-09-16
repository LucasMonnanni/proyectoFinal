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
    
    const prevPageLink = document.getElementById('prevPageLink');
    const nextPageLink = document.getElementById('nextPageLink');
    if (data.hasPrevPage) {
        prevPageLink.onclick = async () =>{
            await getProducts(data.prevLink)
        }
    } else {
        prevPageLink.disabled = true
        prevPageLink.onclick = () =>{}
    }
    if (data.hasNextPage) {
        nextPageLink.onclick = async () => {
            await getProducts(data.nextLink)
        }
    } else {
        nextPageLink.disabled = true
        nextPageLink.onclick = () =>{}
    }
}



document.addEventListener('DOMContentLoaded', async () =>{
    let params = {
        limit: 3,
        page: 1,
        sort: 'asc'
    }
    const url = window.location.origin + '/api/products/?'+ new URLSearchParams(params).toString()
    await getProducts(url)
})