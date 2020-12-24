import IServer from "./interfaces/server/server.interface";
import Fastify from "./interfaces/server/fastify";

const serverApp: IServer = new Fastify();
serverApp.start()