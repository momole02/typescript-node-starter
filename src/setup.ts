import { handler } from "./broker/intelo";
import { requestSession } from "./listeners";

const events = {
  requestSession: "requestSession"
};


export const setupIntelo = () => {
  handler.on(events.requestSession , [requestSession]);
}