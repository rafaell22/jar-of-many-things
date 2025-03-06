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
              const messageBody = JSON.parse(webSocketMessage.data);

              const event = messageBody.event;
              const data = messageBody.data;
              if(event && this.events[event]) {
                  this.events[event].cb(data);
              }
            }
            resolve();
          }
        }, 100);
      });
    }
}

