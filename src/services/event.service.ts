import IGithubEvent from "src/entities/github-event.interface";
import IGithubUser from "src/entities/github-user.interface";
import IGitHub from "src/interfaces/github/github.interface";
import ISanitizer from "src/interfaces/sanitizer/sanitizer.interface";
import IRepository from "./repository.interface";

export default class EventService {
    private github: IGitHub;
    private repository: IRepository;
    private sanitizer: ISanitizer;

    constructor(github: IGitHub, repository: IRepository, sanitizer: ISanitizer) {
        this.github = github;
        this.repository = repository;
        this.sanitizer = sanitizer;
    }

    getEvents = (user: IGithubUser) => this.github.getEvents(user.login)
        .then((events: IGithubEvent[]) => {
            const sortedEvents = events.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            return sortedEvents.slice(0, 5);
        })
        .then(slicedEvents => {
            const sanitizedEvents = slicedEvents.map(event => this.sanitizer.sanitizeKeys<IGithubEvent, IGithubEvent>(event));
            return this.repository.save(user, sanitizedEvents).then(_ => slicedEvents);
        })
        .then(slicedEvents => {
            const eventsMap = new Map<string, IGithubEvent>(slicedEvents.reduce<[string, IGithubEvent][]>((prev: [string, IGithubEvent][], current): [string, IGithubEvent][] => {
                prev.push([current.id, current])
                return [...prev, [current.id, current]]
            }, []));
            return eventsMap;
        })
}