import GistRepository from "../../src/services/gist-repository";
import MongoDB from "../../src/interfaces/database/mongodb/mongodb";

test("Should have 'gists' as collection", async () => {
    const db = new MongoDB("", "");
    const gistRepository = new GistRepository(db);
    expect(gistRepository.COLLECTION).toBe('gists');
});

test("Should filter existing gists", async () => {
    const db = new MongoDB("", "");
    const user = { login: "myLogin" };
    const createAt = `${new Date(1608796742099)}`;
    const existingGist = { id: "0", created_at: createAt };
    const nonExistingGist = { id: "1", created_at: createAt };
    const gists = [existingGist, nonExistingGist];
    const gistRepository = new GistRepository(db);
    const spyFind = jest.spyOn(db, 'find');
    const spySave = jest.spyOn(db, 'save');
    const collection = gistRepository.COLLECTION;
    const filter = { _id: { $in: ['0', '1'] } };

    spyFind.mockReturnValue(new Promise(resolve => resolve([existingGist])));
    spySave.mockReturnValue(new Promise(resolve => resolve(null)));

    expect(await gistRepository.save(user, gists)).toBe(undefined);
    expect(spyFind).toBeCalledWith(collection, filter);
    spyFind.mockRestore();
    spySave.mockRestore();
});

test("Should save non existing gists", async () => {
    const db = new MongoDB("", "");
    const user = { login: "myLogin" };
    const createAt = `${new Date(1608796742099)}`;
    const existingGist = { id: "0", created_at: createAt };
    const nonExistingGist = { id: "1", created_at: createAt };
    const gists = [existingGist, nonExistingGist];
    const gistRepository = new GistRepository(db);
    const spyFind = jest.spyOn(db, 'find');
    const spySave = jest.spyOn(db, 'save');
    const collection = gistRepository.COLLECTION;
    const gistsToBeSaved = [{ ...nonExistingGist, _id: nonExistingGist.id, githubuser: user.login }];

    spyFind.mockReturnValue(new Promise(resolve => resolve([existingGist])));
    spySave.mockReturnValue(new Promise(resolve => resolve(null)));

    expect(await gistRepository.save(user, gists)).toBe(undefined);
    expect(spySave).toBeCalledWith(collection, gistsToBeSaved);
    spyFind.mockRestore();
    spySave.mockRestore();
});