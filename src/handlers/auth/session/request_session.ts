
import { EventListenerCallback, SendCallback } from "../../../intelo/event_handler";
import { glo } from "../../../services/logger/logger";

export const requestSession:EventListenerCallback = async (data: any, send: SendCallback, abort) => {
  glo.console.debug("Data" , data);
  send({
    "fake_sess_id" : 1234
  })
}