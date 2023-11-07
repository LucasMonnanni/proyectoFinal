const getProducts = async (url) => {
    console.log(url)
    const response = await fetch(url)
    return await response.json();
}

const renderProducts = (data) => {
    console.log(data)
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = ''
    data.payload.forEach((product)=>{
        const d = document.createElement('div')
        d.classList.add(['card'])
        d.innerHTML = `
        <div class="card-header">
            <b>${product.title}</b>
        </div>`
        if (product.thumbnails.length) {
            d.innerHTML += `<img src="${product.thumbnails[0]}" class="card-img-top">`
        }
        const body = document.createElement('div')
        body.classList.add(['card-body'])
        body.innerHTML = `
        <p class="card-text"><b>Descripción: </b></p>
        <p class="card-text">${product.description}</p>
        <p class="card-text"><b>Precio: </b>${product.price}</p>
        <p class="card-text"><b>Código: </b>${product.code}</p>
        <p class="card-text"><b>Categoría: </b>${product.category}</p>
        <p class="card-text"><b>Stock: </b>${product.stock}</p>
        `
        const addUrl = window.location.origin + '/api/carts/' + document.cartId + '/product/' + product._id
        const b = document.createElement('a')
        b.classList.add('btn', 'btn-secondary')
        b.href = '#'
        b.innerHTML = 'Agregar al carrito'
        b.onclick = async () => {
            const res = await fetch(addUrl, {method:'POST'})
            const data = await res.json()
            console.log(data)
        }
        body.appendChild(b)
        d.appendChild(body)
        const c = document.createElement('div')
        c.classList.add('col')
        c.appendChild(d)
        productsDiv.appendChild(c)
    });
    
    const prevPageButton = document.getElementById('prevPageButton');
    const nextPageButton = document.getElementById('nextPageButton');
    if (data.hasPrevPage) {
        prevPageButton.onclick = async () =>{
            const productData = await getProducts(data.prevLink)
            renderProducts(productData)
        }
        prevPageButton.classList.remove('disabled')
    } else {
        prevPageButton.classList.add('disabled')
        prevPageButton.onclick = () =>{}
    }
    if (data.hasNextPage) {
        nextPageButton.onclick = async () => {
            const productData = await getProducts(data.nextLink)
            renderProducts(productData)
        }
        nextPageButton.classList.remove('disabled')
    } else {
        nextPageButton.classList.add('disabled')
        nextPageButton.onclick = () =>{}
    }
}

const getUserData = async () => {
    const data = await (await fetch('/api/sessions/current', {
        method: 'GET'
    })).json()
    console.log(data)
    if (data.status == 'Success') {
        return data.payload
    } else {
        return false
    }
}

const renderUser = (data) => {
    const userDiv = document.getElementById('user');
    userDiv.innerHTML = `<h4 class="card-title">Bienvenido ${data.firstName || '' } ${data.lastName || ''}!</h4>\n`
    data.email ? userDiv.innerHTML += `<p class="card-text">Email: ${data.email} </p>` : false
    data.age ? userDiv.innerHTML += `<p class="card-text">Edad: ${data.age}</p>` : false
    data.role ? userDiv.innerHTML += `<p class="card-text">Rol: ${data.role}</p>` : false
    document.getElementById('cartLink').href = `/carts/${data.cart}`
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
        limit: 6,
        page: 1,
        sort: 'asc'
    }
    const userData = await getUserData()
    document.cartId = userData.cart
    renderUser(userData)
    const url = window.location.origin + '/api/products/?'+ new URLSearchParams(params).toString()
    const productData = await getProducts(url)
    renderProducts(productData)
})