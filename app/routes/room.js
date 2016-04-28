import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.messages;
  },
  channel: null,
  messages: null,
  init: function() {
    let socket = this.get('phoenix').socket();
    let room = socket.channel("rooms:lobby", {});
    this.store.findAll('message').then((messages) =>{
      this.set('messages', messages);
    });
    this.set('channel', room);
    room.join().receive('ok', (data) => {
      this.store.unloadAll('message');
      data.messages.forEach((messageData) => {
        this.renderMessage(messageData);
        this.refresh();
      });
    });
    room.on("new:message", msg => this.renderMessage(msg));
  },
  renderMessage: function(data) {
    let messageData = data.message;
    let newMessage = this.store.push({
      data: {
        id: messageData.id,
        type: 'message',
        attributes: {
          body: messageData.body,
          createdAt: messageData.createdAt
        }
      }
    });
    this.messages.pushObject(newMessage._internalModel);
  },
  actions: {
    sendMessage: function(message) {
      this.get('channel').push("new:message", {body: message});
      this.set('newMessage', null);
      this.controller.set('newMessage', '');
    }
  }
});
