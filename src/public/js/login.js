const form = document.getElementById('loginForm');

form.addEventListener('submit', e=> {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key)=> obj[key]=value);
    fetch('api/sessions/login',{
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(response=> {
        console.log(response)
        if (response.redirected) {
            window.location.href = response.url;
        }
    }).catch(response => {
        console.log(error)
    })
})

const button = document.getElementById('registerButton');
button.onclick = ()=>{
    window.location = '/register'
}