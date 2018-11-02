import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser : {
        name: 'Anonymous',
        color: 'Black'
      },
      messages    : [],
      onlineUsers : 0
    };
    this.createMessage = this.createMessage.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.socket = new WebSocket('ws://localhost:3001');
  }

  createMessage(username,content,color){
    const newMessage = {
      username: username,
      content: content,
      type: 'postMessage',
      color: color
    }

    this.socket.send(JSON.stringify(newMessage));
  }

  changeUsername(username,color){
    console.log(username.length);
    var userName;
    if(username.length > 0){
      userName = username;
    } else{
      userName = 'Anonymous';
    }

    var newNotification = {
      type: "postNotification",
      content: `${this.state.currentUser.name} has changed their name to ${userName}`,
      username: `${userName}`,
      color: color
    };

    var newCurrentUser = {
      name: userName,
      color: color
    }
    this.setState({
      currentUser : newCurrentUser
    })

    this.socket.send(JSON.stringify(newNotification));
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket.onopen = (event) => {
      console.log("Connected to server");
    };

    this.socket.onmessage = (event) =>{
      var data = JSON.parse(event.data);
      switch(data.type){
        case "onlineUsers":
          let count = data.count;
          this.setState({
            onlineUsers: count
          })
          break;

        case "userColor":
          let color = data.color;
          let newCurrentUser = this.state.currentUser;
          newCurrentUser.color = color;
          this.setState({
            currentUser: newCurrentUser
          })

          break;

        default:
          var newMessage = data;
          var oldMessages = this.state.messages;
          var newMessages = oldMessages.concat(newMessage);

          this.setState({
            messages: newMessages
          });
      }
    }
  }

  render() {
    return (
      <div>
      <nav className="navbar">
         <a href="/" className="navbar-brand">Chatty</a>
         <span className = 'online-users'>{this.state.onlineUsers} users online</span>
      </nav>
      <MessageList messages={this.state.messages} currentUser={this.state.currentUser}/>
      <ChatBar currentUser={this.state.currentUser} createMessage={this.createMessage} messages={this.state.messages} changeUsername={this.changeUsername}/>
      </div>

    );
  }
}
export default App;
