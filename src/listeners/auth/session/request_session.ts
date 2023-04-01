
import { EventListenerCallback, SendCallback } from "../../../broker/event_handler";
import { glo } from "../../../services/logger/logger";

export const requestSession:EventListenerCallback = async (data: any, send: SendCallback, abort) => {
  glo.console.debug("Data" , data);
  send({
    "fake_sess_id" : 1234
  })
}