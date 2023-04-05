import { handler } from "./broker/intelo";
import { events } from "./events";
import { requestSession, 
  createVMTask, 
  runVMTask, 
  checkVMTask, 
  terminateVMTask } from "./listeners";


export const setupListeners = () => {
  handler.on(events.requestSession , [requestSession]);
  handler.on(events.runVMTask, [runVMTask]);
  handler.on(events.createVMTask, [createVMTask]);
  handler.on(events.checkVMTask, [checkVMTask])
  handler.on(events.terminateVMTask, [terminateVMTask])
}