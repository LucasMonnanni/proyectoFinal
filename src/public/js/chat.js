let user;
document.addEventListener('DOMContentLoaded', () =>{

    const socket = io();
    const chatBox = document.getElementById('chatBox');
    const log = document.getElementById('messageLogs');

    Swal.fire({
        title: "Identificate",
        input: "text",
        text: "Ingresa una dirección de correo identificarte",
        inputValidator: (value) => {
            return !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) && 'Ingresa un correo válido'
        },
        allowOutsideClick: false,
    }).then(result => {
        user = result.value
        socket.emit('authenticated', {user});
    })

    chatBox.addEventListener('keyup', evt => {
        if (evt.key === "Enter") {
            if (chatBox.value.trim().length > 0) {
                socket.emit('message', { user: user, message: chatBox.value })
                chatBox.value = '';
            }
        }
    })

    socket.on('messageLogs', data => {
        if (!user) return;
        let messages = '';
        data.forEach(message => {
            messages = messages + `${message.user} dice: ${message.message} </br>`
        })
        log.innerHTML = messages;
    })

    socket.on('newUserConnected', data=>{
        if (!data.user) return
        Swal.fire({
            toast: true,
            position: "top-right",
            text: "Nuevo usuario conectado",
            title: `${data.user} se ha unido al chat`,
            timer: 3000,
            showConfirmButton: false
        })
    })
})