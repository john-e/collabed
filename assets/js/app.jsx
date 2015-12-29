var React = require('react'),
    ReactDOM = require('react-dom');

var InputBox = require('./InputBox.jsx'),
    Editor = require('./Editor.jsx');

var socketIO = require('socket.io-client');

var ChatApp = React.createClass({
    socket: null,

    getInitialState: function(){
        return {
            unread: 0,
            name: '',
            messages: []
        };
    },

    changeName: function(value){
        this.setState({
            name: value
        });
    },

    sendChatMessage: function(message){
        this.socket && this.socket.emit('chat-message', message);
    },

    onConnect: function(){
        console.log('connected');
    },

    onChatRecieved: function(message){
        var messages = this.state.messages;
        messages.push(message);
        this.setState({
            messages: messages
        });
    },

    onDisconnect: function(){
        console.log('disconnected :(');
    },

    onNewUserConnected: function(username){
        this.onChatRecieved({user: 'Connected', message: username});
    },

    onNewUserDisconnected: function(username){
        this.onChatRecieved({user: 'Disconnected', message: username});
    },

    componentDidUpdate: function() {
      var node = this.refs.messages;
      node.scrollTop = node.scrollHeight;
    },

    render: function() {
        if(this.state.name=='')
            return <div className="details">
                <InputBox label="Enter Name" onChange={this.changeName} button="Continue"/>
            </div>;

        if(!this.socket){
            this.socket = socketIO('http://192.168.3.187:3000/', { query: 'user='+this.state.name });
            this.socket.on('connect', this.onConnect);
            this.socket.on('chat-message', this.onChatRecieved);
            this.socket.on('disconnect', this.onDisconnect);
            this.socket.on('user-connected', this.onNewUserConnected);
            this.socket.on('user-disconnected', this.onNewUserDisconnected);
        }

        var messages = '';
        if(this.state.messages.length > 0)
            messages = this.state.messages.map(function(item, idx){
                return (
                  <li key={idx}>{item.user}: {item.message}</li>
                );
            }, this);

        return (
            <div className="messenger">
                <div className="editor">
                    <Editor socket={this.socket}/>
                </div>
                <div className="chatbox">
                    <div className="chats"><ul id="messages" ref="messages">{messages}</ul></div>
                    <InputBox onChange={this.sendChatMessage} button="Send" clearOnSubmit={true}/>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
  <ChatApp />,
  document.getElementById('content')
);