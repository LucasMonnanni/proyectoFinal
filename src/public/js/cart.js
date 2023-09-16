getProducts = async (url) => {
    const response = await fetch(url)
    const data = await response.json();
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = ''
    console.log(data)
    data.products.forEach((item)=>{
        const d = document.createElement('div')
        d.innerHTML = `<p><b>Título: </b> ${item.product.title}</p>
        <p><b>Descripción: </b></p>
        <p>${item.product.description}</p>
        <p><b>Precio: </b>${item.product.price}</p>
        <p><b>Cantidad: </b>${item.quantity}</p>
        <hr>`
        productsDiv.appendChild(d)
    });

}

document.addEventListener('DOMContentLoaded', async () =>{
    const url = window.location.origin + '/api/carts/'+ document.cartId
    await getProducts(url)
})