import { glo } from "../services/logger/logger";

/**
 * Callback de reponse
 */
export type SendCallback = (resp:any) => void
/**
 * Callback de reponse à un évenement
 */
export type EventListenerCallback = (data: any, send: SendCallback, abort: () => void) => Promise<any>;

/**
 * Gestionnaire global d'évenements
 */
export class GlobalEventHandler
{

  static instance = new GlobalEventHandler();
  private handlers: {[key:string]:EventListenerCallback[]};
  /**
   * Constructeur
   */
  private constructor(){
    this.handlers = {};
  }

  /**
   * Ratache un évenement à une serie de callbacks
   * @param {string} eventName 
   * @param {EventListenerCallback[]} callbacks 
   */
  on(eventName:string, callbacks:EventListenerCallback[]) {
        glo.console.log(`Registering handler event=${eventName}`)
        this.handlers[eventName] = callbacks;
  }
  /**
   * Détache un évenement 
   * 
   * @param {string} eventName 
   */
  off(eventName:string){
    delete this.handlers[eventName]
  }

  /**
   * Gère les évenements
   * 
   * @param {string} eventName 
   * @param {any} data 
   * @param {SendCallback} send 
   */
  async handleDefault(eventName: string, data:any, send: SendCallback):Promise<any>{
    let aborted = false;
    if(eventName in this.handlers) {  
      for(let k = 0 ;!aborted &&  k < this.handlers[eventName].length ; ++k){
        this.handlers[eventName][k](data, send, () => aborted = true);
      }
    }
  }
}
