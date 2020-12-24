import IServer from "./server.interface";
import FastifyClass, { FastifyInstance, RouteShorthandOptions } from "fastify";
import StatsService from "../../services/stats.service";
import createGithubUserDTO from "../dtos/github-user-dto";

export default class Fastify implements IServer {
    private server: FastifyInstance;

    constructor() {
        this.server = FastifyClass({
            logger: {
                level: process.env.LOGGER_LEVEL
            }
        });
        this.setupRoutes();
    }

    private setupRoutes = () => {
        this.setupStatsRoute();
    }

    private setupStatsRoute = () => {
        const opts: RouteShorthandOptions = {
            schema: {
                body: {
                    type: 'object',
                    required: ['users'],
                    properties: {
                        users: {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        };
        this.server.post('/stats', opts, async (_request, _reply) => {
            const { users } = _request.body as { users: string[] };
            const statsService = new StatsService();
            return _reply.send((await statsService.getStats(users)).map(createGithubUserDTO));
        });
    }

    start = async () => {
        try {
            await this.server.listen(`${process.env.PORT}`);
            const address = this.server.server.address();
            const port = typeof address === 'string' ? address : address?.port;
            this.server.log.info(`server listening on ${port}`)
        } catch (err) {
            this.server.log.error(err);
            process.exit(1);
        }
    };
}