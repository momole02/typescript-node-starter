import { glo, GlobalLogger } from "./services/logger/logger"
import {WebSocketServer} from "ws";
import { IncomingMessage } from "http";
import { broker } from "./broker/intelo";
import { setupListeners } from "./setup";
import { MessageBroker } from "./broker/message_broker";

/// Retourne l'addresse ip du client à partir du message
/// [req]
const getClientAddress = (req : IncomingMessage) => {
  const origin = req.socket.remoteAddress;
  const fwd = req.headers['x-forwarded-for']
    ?.toString()
    .split(",")[0].trim();
  return {origin, fwd};
}

/// Démarre le serveur de WebSockets
export const bootstrapApp = (port: number) => {  
    glo.console.log("######################################################");
    glo.console.log("Intelo ETL Engine (C) 2023 Yenoo");
    glo.console.log("######################################################");
    glo.console.log("Starting WebSocket server ...");

    const wss = new WebSocketServer({port});
    wss.on("connection" , (ws, req: IncomingMessage) => {

      glo.console.log("Peer connected " , getClientAddress(req));
      ws.send("Intelo ETL v1.0.1 / WebSocket");

      // En cas d'erreur on l'affiche 
      ws.on("error" , glo.console.error);

      // En cas d'interception de message
      ws.on("message" ,(data) => {
          glo.console.info("Got message processing ...");
          glo.console.debug(JSON.parse(data.toString()))
          // Le message est transféré à la bonne entité
          broker.dispatch(MessageBroker.fromBuffer(data) , (data) => ws.send(JSON.stringify(data)))
            .then()
      });
    });
  glo.console.log(`Websocket server listening on ::1:${port}`)
  setupListeners();
};

