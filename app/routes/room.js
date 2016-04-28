import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.messages;
  },
  channel: null,
  messages: [],
  init: function() {
    let socket = this.get('phoenix').socket();
    let room = socket.channel("rooms:lobby", {});
    this.set('messages', this.store.findAll('message'))
    this.set('channel', room);
    room.join().receive('ok', (data) => {
      console.log(data);
    });
    room.on("new:message", msg => this.renderMessage(msg));
  },
  renderMessage: function(data) {
    let messageData = data.message;
    let newMessage = this.store.createRecord('message', {
      id: messageData.id,
      body: messageData.body
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
