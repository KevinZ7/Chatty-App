import React, {Component} from 'react';


class ChatBar extends Component {

  constructor(){
    super();
    this.changeHandler = this.changeHandler.bind(this);

  }

  changeHandler(event){

    let color = this.props.currentUser.color;

    if(event.key == 'Enter' && event.target.className === 'chatbar-message'){
      var value = event.target.value
      let user = this.props.currentUser.name
      this.props.createMessage(user,event.target.value,color);
      event.target.value = '';
    } else if(event.target.className === 'chatbar-username' && event.key == 'Enter'){
      var username = event.target.value;
      this.props.changeUsername(username,color);
    }
  }


  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" onKeyPress={this.changeHandler}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={this.changeHandler}/>
      </footer>
    );
  }
}


export default ChatBar;