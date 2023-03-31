import { handler } from "./intelo/intelo";
import { requestSession } from "./handlers";

const events = {
  requestSession: "requestSession"
};


export const setupIntelo = () => {
  handler.on(events.requestSession , [requestSession]);
}