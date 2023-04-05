import { bootstrapApp } from "./app";
global.vmTasks= []
global.vmTasksPools = {}

// démarre le serveur de websockets sur le port ::8080
bootstrapApp(8080);
