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
            const productData = await getProducts(data.prevLink)
            renderProducts(productData)
        }
        prevPageButton.disabled = false
    } else {
        prevPageButton.disabled = true
        prevPageButton.onclick = () =>{}
    }
    if (data.hasNextPage) {
        nextPageButton.onclick = async () => {
            const productData = await getProducts(data.nextLink)
            renderProducts(productData)
        }
        nextPageButton.disabled = false
    } else {
        nextPageButton.disabled = true
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
    userDiv.innerHTML = `<h4>Bienvenido ${data.firstName || '' } ${data.lastName || ''}!</h4>\n`
    data.email ? userDiv.innerHTML += `<p>Email: ${data.email} </p>` : false
    data.age ? userDiv.innerHTML += `<p>Edad: ${data.age}</p>` : false
    data.role ? userDiv.innerHTML += `<p>Rol: ${data.role}</p>` : false

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
        limit: 3,
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