import { SendCallback } from "../../../broker/event_handler";
import { CommonRequest } from "../../../broker/message_broker";
import { glo } from "../../../services/logger/logger";
import { ErrorCodes } from "../../error";

/**
 * Check le statut d'une tâche
 * 
 * request data = {
 *  taskId: ID de la tâche
 * }
 * @param {CommonRequest} request 
 * @param {SendCallback} send
 */
export default async (request: CommonRequest, send: SendCallback) => {

  try {
    const task = global.vmTasks.find((task) => task.id == request.data.taskId);
    if(task != null){
      send({
        success: true,
        requestId: request.id,
        data : {
          task,
        }
      })
    }else{
      send({
        success: false,
        requestId: request.id,
        errorCode: ErrorCodes.taskIdNotFound,
      })
    }
  } catch (error) {
    glo.console.error(`Failed when checking task status requestId=${request.id}`)
    glo.console.error(error);
    send({
      success: false,
      error: ErrorCodes.internalError,
      requestId: request.id,
    })
  }
}