import React, {Component} from 'react';

class Message extends Component {
  switch(type){
    switch(type){
      case "incomingMessage":
        return (<div className="message">
          <span className="message-username" style={{color:this.props.color}}>{this.props.message.username}</span>
          <span className="message-content">{this.props.message.content}</span>
        </div>)

        break;

      case "incomingNotification":
        return (<div className="notification">
          <span className="notification-content">{this.props.message.content}</span>
        </div>)
        break;

      default:
        return null;

    }
  }

  render() {
    return this.switch(this.props.message.type);

  }
}
export default Message;
