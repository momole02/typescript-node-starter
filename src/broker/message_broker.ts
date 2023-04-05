import { glo } from "../services/logger/logger";
import { EventHandlerError } from "./error";
import { GlobalEventHandler, SendCallback } from "./event_handler";

/**
 * Représente le format d'une requête quelconque
 *
 * */ 
export interface CommonRequest
{
  id: string; /** ID de la requête */
  event: string; /** Nature de l'évenement */
  data: any; /** données de l'évenement */
}

/**
 * Représente le format d'une reponse quelconque
 */
export interface CommonResponse
{
  success: boolean;   /** La requête à t'elle aboutie ? */
  errorCode?: string; /** Code d'erreur (en cas d'erreur)*/
  data?: any; /** Données */
  error?: any; /** Données d'erreur */
  requestId: string; /** ID de la requête associé */
}

/**
 * Décode une expression JSON et retourne null en cas d'erreurs
 * au lieu de lancer un exception
 * @param payload 
 * @return 
 */
const jsonDecodePayload = (payload: string) => {
  try {
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

/**
 * Broker de messagerie sensé envoyer les messages vers les différents listeners
 */
export class MessageBroker 
{
  static instance = new MessageBroker();

  /**
   * Convertis une reponse en tampon string JSON
   * @param {CommonResponse} data 
   */
  static toBuffer = (data:CommonResponse) => {
    return JSON.stringify(data);
  };

  /**
   * Décode un message JSON
   * @param {any} data 
   */
  static fromBuffer = (data:any) => {
    return jsonDecodePayload(data.toString());
  }

  /**
   * Constructeur
   */
  private constructor (){ }

  /**
   * Envoie le message vers le bon listener
   * @param payload 
   * @returns 
   */
  async dispatch(payload: CommonRequest , send: SendCallback) :Promise<CommonResponse> {
      try{
        const message = payload;
        if(null == message){
          throw new EventHandlerError("Invalid message");
        }
        const data = await GlobalEventHandler
            .instance
            .handleDefault(message.event, message, send)
        return {
          success: true, 
          data, 
          requestId: payload.id,
        }
      }catch(error){
        // TODO : Implémenter un bon gestionnaire d'erreurs
        glo.console.error(error);
        return {
          success: false, 
          error,
          requestId: payload.id,
        }
      }
  }
}
