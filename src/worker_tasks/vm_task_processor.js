const {parentPort} = require("worker_threads")
const vm = require("node:vm")

parentPort.on("message" , (task) => {
  let {code, context} = task.runtime // recuperer les données d'execution
  vm.createContext(context); 
  console.log({code, context})
  vm.runInContext(code, context); // Lancer la tâche
  parentPort.postMessage(context); 
})