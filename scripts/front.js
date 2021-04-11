// DOM parts
const chatList = document.querySelector('.chat-list');
const chatFormField = document.querySelector('.new-chat');
const nameFormField = document.querySelector('.new-name');
const updateMssg = document.querySelector('.update-mssg');
const room = document.querySelector('.chat-rooms');

// create the object of the backe
const username = localStorage.username ? localStorage.username: 'Anonymous';
const appUI = new AppUI(chatList);
const backset = new Backset('gaming', 'Anonymous');

chatFormField.addEventListener('submit', e => {
    e.preventDefault();
    const message = chatFormField.message.value.trim();
    backset.addChat(message)
    .then(() => {
         chatFormField.reset();
         scrollBy(0,110);
    }).catch(err => console.log(err));
    
});
nameFormField.addEventListener('submit', e => {
   e.preventDefault();
   const name = nameFormField.name.value.trim();
   backset.updateName(name);
   nameFormField.reset();
   updateMssg.innerText = `Your name was update to ${name}`;
   setTimeout(() => updateMssg.innerText = ``,3000);
});

room.addEventListener('click', e =>{
    if(e.target.tagName === 'BUTTON'){
        const btn = Array.from(document.getElementsByClassName('btn'));      //  btn.setAttribute('class','active');
        btn.forEach(button =>{
             if(button.getAttribute('id')===e.target.getAttribute('id')){
                button.className='btn active';
                document.querySelector('h5').textContent = e.target.getAttribute('id') + ' Room';
                console.log(button);
             }else{
                button.className='btn';
             }  
        });
       // console.log(btn.classList.length);//.match(e.target.getAttribute('id')));
        appUI.clear();
        backset.updateRoom(e.target.getAttribute('id'));
        backset.getChats((chat, id) => appUI.render(chat, id));
    }

});
/*
backset.addChat('hello').then(() => console.log('chat added'))
.catch(err => console.log(err));*/

backset.getChats((data, id) => {
    appUI.render(data, id);
    scrollBy(0,110);
});

const deleteMsgFromSite = (id) => {
    const messages = document.querySelectorAll('li');
    console.log(messages);
    messages.forEach(msg =>{
        if(msg.getAttribute('data-id')=== id){
            console.log(msg);
            msg.remove();
        }
    });
};
chatList.addEventListener('click', e =>{
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        backset.deleteMsg(id);
    }
})