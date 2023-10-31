let user;
document.addEventListener('DOMContentLoaded', async () =>{
    const socket = io();

    const data = await (await fetch('/api/sessions/current', {
        method: 'GET'
    })).json()
    if (data.status == 'Success') {
        const user = data.payload.email
        socket.emit('authenticated', {user});
    } else {
        return
    }

    const chatBox = document.getElementById('chatBox');
    const log = document.getElementById('messageLogs');

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