import { handler } from "./broker/intelo";
import { requestSession, runSimpleTask } from "./listeners";

const events = {
  requestSession: "requestSession",
  runSimpleTask: "runSimpleTask"
};


export const setupIntelo = () => {
  handler.on(events.requestSession , [requestSession]);
  handler.on(events.runSimpleTask, [runSimpleTask]);
}