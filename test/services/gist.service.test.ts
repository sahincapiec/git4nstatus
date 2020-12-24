import GistService from "../../src/services/gist.service";
import MongoDB from "../../src/interfaces/database/mongodb/mongodb";
import Octonode from "../../src/interfaces/github/octonode";
import GistRepository from "../../src/services/gist-repository";
import Sanitizer from "../../src/interfaces/sanitizer/sanitizer";
import IGithubGist from "../../src/entities/github-gist.interface";
import IGithubUser from "../../src/entities/github-user.interface";

let spyGithubGetGists: jest.SpyInstance<Promise<IGithubGist[]>, [login: string]>;
let spySanitizerSanitizeKeys: jest.SpyInstance<unknown, [object: unknown]>;
let spyRepositorySave: jest.SpyInstance<Promise<void>, [user: IGithubUser, gists: IGithubGist[]]>;
let gistService: GistService;
let user: IGithubUser;
let userLogin: string;
let newerGist1: IGithubGist;
let newerGist2: IGithubGist;
let newerGist3: IGithubGist;

beforeEach(() => {
    const github = new Octonode();
    const db = new MongoDB("", "");
    const repository = new GistRepository(db);
    const sanitizer = new Sanitizer();
    userLogin = 'myLogin';
    user = { login: userLogin };
    const newerCreateAt = `${new Date(1608796742099)}`;
    const olderCreateAt = `${new Date(1608793742099)}`;
    newerGist1 = { id: "0", created_at: newerCreateAt };
    newerGist2 = { id: "2", created_at: newerCreateAt };
    newerGist3 = { id: "4", created_at: newerCreateAt };
    const newerGists = [newerGist1, newerGist2, newerGist3];
    const olderGist = { id: "1", created_at: olderCreateAt };
    const gists = [olderGist, ...newerGists];
    gistService = new GistService(github, repository, sanitizer);
    spyGithubGetGists = jest.spyOn(github, 'getGists');
    spySanitizerSanitizeKeys = jest.spyOn(sanitizer, 'sanitizeKeys');
    spyRepositorySave = jest.spyOn(repository, 'save');
    spyGithubGetGists.mockReturnValue(new Promise(resolve => resolve(gists)));
    spySanitizerSanitizeKeys.mockReturnValueOnce(newerGist1).mockReturnValueOnce(newerGist2)
        .mockReturnValueOnce(newerGist3);
    spyRepositorySave.mockReturnValue(new Promise((resolve) => resolve()));
});

afterEach(() => {
    spyGithubGetGists.mockRestore();
    spySanitizerSanitizeKeys.mockRestore();
    spyRepositorySave.mockRestore();
});

test("Should get 3 most recent gist", async () => {
    await gistService.getGists(user);

    expect(spyGithubGetGists).toBeCalledWith(userLogin);
});

test("Should save 3 most recent gists", async () => {
    await gistService.getGists(user);

    expect(spyGithubGetGists).toBeCalledWith(userLogin);
});

test("Should return 3 most recent gists", async () => {
    const expectedResult = [newerGist1, newerGist2, newerGist3];

    const result = await gistService.getGists(user)

    expect(result).toEqual(expectedResult);
});