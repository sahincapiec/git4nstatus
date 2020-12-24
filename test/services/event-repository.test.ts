import EventRepository from "../../src/services/event-repository";
import MongoDB from "../../src/interfaces/database/mongodb/mongodb";

test("Should have 'events' as collection", async () => {
    const db = new MongoDB("", "");
    const eventRepository = new EventRepository(db);
    expect(eventRepository.COLLECTION).toBe('events');
});

test("Should filter existing events", async () => {
    const db = new MongoDB("", "");
    const user = { login: "myLogin" };
    const createAt = `${new Date(1608796742099)}`;
    const existingEvent = { id: "0", created_at: createAt };
    const nonExistingEvent = { id: "1", created_at: createAt };
    const events = [existingEvent, nonExistingEvent];
    const eventRepository = new EventRepository(db);
    const spyFind = jest.spyOn(db, 'find');
    const spySave = jest.spyOn(db, 'save');
    const collection = eventRepository.COLLECTION;
    const filter = { _id: { $in: ['0', '1'] } };

    spyFind.mockReturnValue(new Promise(resolve => resolve([existingEvent])));
    spySave.mockReturnValue(new Promise(resolve => resolve(null)));

    expect(await eventRepository.save(user, events)).toBe(undefined);
    expect(spyFind).toBeCalledWith(collection, filter);
    spyFind.mockRestore();
    spySave.mockRestore();
});

test("Should save non existing events", async () => {
    const db = new MongoDB("", "");
    const user = { login: "myLogin" };
    const createAt = `${new Date(1608796742099)}`;
    const existingEvent = { id: "0", created_at: createAt };
    const nonExistingEvent = { id: "1", created_at: createAt };
    const events = [existingEvent, nonExistingEvent];
    const eventRepository = new EventRepository(db);
    const spyFind = jest.spyOn(db, 'find');
    const spySave = jest.spyOn(db, 'save');
    const collection = eventRepository.COLLECTION;
    const eventsToBeSaved = [{ ...nonExistingEvent, _id: nonExistingEvent.id, githubuser: user.login }];

    spyFind.mockReturnValue(new Promise(resolve => resolve([existingEvent])));
    spySave.mockReturnValue(new Promise(resolve => resolve(null)));

    expect(await eventRepository.save(user, events)).toBe(undefined);
    expect(spySave).toBeCalledWith(collection, eventsToBeSaved);
    spyFind.mockRestore();
    spySave.mockRestore();
});