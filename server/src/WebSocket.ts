import ws from "ws";

const wss = new ws.Server(
  {
    port: 8080,
  },
  () => {
    console.log("Server started on port - 8080");
  }
);

wss.on("connection", function connection(arg: any) {
  arg.on("message", (message) => {
    message = JSON.parse(message);
    switch (message.event) {
      case "message":
        broadcastMessage(message);
        break;

      case "connection":
        broadcastMessage(message);
        break;
    }
  });
});

const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};
