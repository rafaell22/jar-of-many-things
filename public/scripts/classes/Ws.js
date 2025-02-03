export default class Ws {
    constructor() {
        this.connected = false;
        this.ws = null;
        this.URL = 'ws://localhost:8080/websockets';
    }

    /**
     * @param {object} events
     * @param {string} events{}.event
     * @param {function} events{}.cb
     */
    connect(events) {
      this.ws = new WebSocket(this.URL);
      this.events = events;
      return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if(this.ws.readyState === 1) {
            console.log('WebSocket connected!'); 
            clearInterval(timer)
            this.connected = true;

            this.ws.onmessage = (webSocketMessage) => {
              console.log('New message!');
              const messageBody = JSON.parse(webSocketMessage.data);
              console.log('messageBody: ', messageBody)

              const event = messageBody.event;
              if(event && this.events[event]) {
                  this.events[event].cb(messageBody);
              }
            }
            resolve();
          }
        }, 100);
      });
    }
}

