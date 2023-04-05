import { SendCallback } from "../../../broker/event_handler";
import { CommonRequest } from "../../../broker/message_broker";
import { glo } from "../../../services/logger/logger";
import { ErrorCodes } from "../../error";

/**
 * Termine une tâche de force
 * (EXPERIMENTAL)
 * 
 * request data = {
 *  taskId: ID de la tâche
 * }
 * 
 * 
 */
export default async (request: CommonRequest, send: SendCallback) => {
  try {
    const taskId = request.data.taskId;
    const pool = global.vmTasksPools[taskId]
    if(null == pool){
      send({
        success: false, 
        requestId: request.id, 
        errorCode: ErrorCodes.taskIdNotFound,
      })
    }else{
      pool.terminateAll();
      delete global.vmTasksPools[taskId];
      send({
        success: true,
        requestId: request.id,
      })
    }
  } catch (error) {
    glo.console.error(`Error when terminating task requestId=${request.id} , taskId=${request.data.taskId} `)
    glo.console.error(error);
    send({
      success: false,
      error: ErrorCodes.internalError , 
      requestId: request.id,
    })
  }
}