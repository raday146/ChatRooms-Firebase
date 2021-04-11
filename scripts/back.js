
// ADD YOUR SERVERLESS INFO 
const connector = {
    apiKey: "replace",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

class Backset{
    constructor(room, username){
          firebase.initializeApp(connector);
          this.db = firebase.firestore().collection('chats');
          this.room = room;
          this.username = username;
          this.unsub;
    }
    async addChat(message){
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created: firebase.firestore.Timestamp.fromDate(now)
        };
        return await this.db.add(chat);
    }  
    // Listener to information flowing 
    getChats(callback){
        this.unsub = this.db.where('room', '==', this.room)
        .orderBy('created')
        .onSnapshot(snapshot =>{
            snapshot.docChanges().forEach(element => {
                if(element.type === 'added'){
                    callback(element.doc.data(), element.doc.id);
                }else if(element.type ==='removed'){
                    console.log(element.doc.id);
                    deleteMsgFromSite(element.doc.id)
                }
            });
        });

    }
    updateName(username){
        this.username = username;
        localStorage.setItem('username',username);
    }
    // switch between rooms
    updateRoom(room){
      this.room = room;
      console.log('room changed');
      if(this.unsub !== null){
          this.unsub();
      }
    }
    // deate conversation    
    deleteMsg(id){
        this.db.doc(id).delete().then(() =>{
            console.log('message deleted');
        }).catch(err => console.log(err));

    }
    
}

