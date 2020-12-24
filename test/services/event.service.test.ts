import EventService from "../../src/services/event.service";
import MongoDB from "../../src/interfaces/database/mongodb/mongodb";
import Octonode from "../../src/interfaces/github/octonode";
import EventRepository from "../../src/services/event-repository";
import Sanitizer from "../../src/interfaces/sanitizer/sanitizer";
import IGithubEvent from "../../src/entities/github-event.interface";
import IGithubUser from "../../src/entities/github-user.interface";

let spyGithubGetEvents: jest.SpyInstance<Promise<IGithubEvent[]>, [login: string]>;
let spySanitizerSanitizeKeys: jest.SpyInstance<unknown, [object: unknown]>;
let spyRepositorySave: jest.SpyInstance<Promise<void>, [user: IGithubUser, events: IGithubEvent[]]>;
let eventService: EventService;
let user: IGithubUser;
let userLogin: string;
let newerEvent1: IGithubEvent;
let newerEvent2: IGithubEvent;
let newerEvent3: IGithubEvent;
let newerEvent4: IGithubEvent;
let newerEvent5: IGithubEvent;

beforeEach(() => {
    const github = new Octonode();
    const db = new MongoDB("", "");
    const repository = new EventRepository(db);
    const sanitizer = new Sanitizer();
    userLogin = 'myLogin';
    user = { login: userLogin };
    const newerCreateAt = `${new Date(1608796742099)}`;
    const olderCreateAt = `${new Date(1608793742099)}`;
    newerEvent1 = { id: "0", created_at: newerCreateAt };
    newerEvent2 = { id: "2", created_at: newerCreateAt };
    newerEvent3 = { id: "4", created_at: newerCreateAt };
    newerEvent4 = { id: "6", created_at: newerCreateAt };
    newerEvent5 = { id: "8", created_at: newerCreateAt };
    const newerEvents = [newerEvent1, newerEvent2, newerEvent3, newerEvent4, newerEvent5];
    const olderEvent = { id: "1", created_at: olderCreateAt };
    const events = [olderEvent, ...newerEvents];
    eventService = new EventService(github, repository, sanitizer);
    spyGithubGetEvents = jest.spyOn(github, 'getEvents');
    spySanitizerSanitizeKeys = jest.spyOn(sanitizer, 'sanitizeKeys');
    spyRepositorySave = jest.spyOn(repository, 'save');
    spyGithubGetEvents.mockReturnValue(new Promise(resolve => resolve(events)));
    spySanitizerSanitizeKeys.mockReturnValueOnce(newerEvent1).mockReturnValueOnce(newerEvent2)
        .mockReturnValueOnce(newerEvent3).mockReturnValueOnce(newerEvent4).mockReturnValueOnce(newerEvent5);
    spyRepositorySave.mockReturnValue(new Promise((resolve) => resolve()));
});

afterEach(() => {
    spyGithubGetEvents.mockRestore();
    spySanitizerSanitizeKeys.mockRestore();
    spyRepositorySave.mockRestore();
});

test("Should get 5 most recent events", async () => {
    await eventService.getEvents(user);

    expect(spyGithubGetEvents).toBeCalledWith(userLogin);
});

test("Should save 5 most recent events", async () => {
    await eventService.getEvents(user);

    expect(spyGithubGetEvents).toBeCalledWith(userLogin);
});

test("Should return 5 most recent events", async () => {
    const expectedResult = new Map<string, IGithubEvent>([["0", newerEvent1], ["2", newerEvent2], ["4", newerEvent3], ["6", newerEvent4], ["8", newerEvent5]]);

    const result = await eventService.getEvents(user)

    expect(result).toEqual(expectedResult);
});