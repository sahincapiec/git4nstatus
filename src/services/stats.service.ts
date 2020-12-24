import IGithubUser from "../entities/github-user.interface";
import MongoDB from "../interfaces/database/mongodb/mongodb";
import IGitHub from "../interfaces/github/github.interface";
import Octonode from "../interfaces/github/octonode";
import Sanitizer from "../interfaces/sanitizer/sanitizer";
import ISanitizer from "../interfaces/sanitizer/sanitizer.interface";
import EventRepository from "./event-repository";
import EventService from "./event.service";
import GistRepository from "./gist-repository";
import GistService from "./gist.service";
import IRepository from "./repository.interface";

export default class StatsService {
    private githubClient: IGitHub;
    private db: IDatabase;
    private eventRepository: IRepository;
    private gistRepository: IRepository;
    private sanitizer: ISanitizer;
    private eventService: EventService;
    private gistService: GistService;

    constructor() {
        this.githubClient = new Octonode();
        this.db = new MongoDB(`${process.env.DATABASE_URI}:${process.env.DATABASE_PORT}/`, `${process.env.DATABASE_NAME}`);
        this.eventRepository = new EventRepository(this.db);
        this.gistRepository = new GistRepository(this.db);
        this.sanitizer = new Sanitizer();
        this.eventService = new EventService(this.githubClient, this.eventRepository, this.sanitizer);
        this.gistService = new GistService(this.githubClient, this.gistRepository, this.sanitizer);
    }

    getStats = async (users: string[]) => {
        const result: IGithubUser[] = [];

        for (const user of users) {
            const userData = { login: user };
            const [events, gists] = await Promise.all([
                this.eventService.getEvents(userData),
                this.gistService.getGists(userData)
            ]);
            result.push({ login: user, events, gists });
        }

        this.db.close();
        return result;
    }
}