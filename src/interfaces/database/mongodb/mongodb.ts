import { MongoClient } from "mongodb";

export default class MongoDB implements IDatabase {
    private dbConnection: MongoClient | undefined;
    private dbName: string;

    constructor(url: string, dbName: string) {
        this.connect(url);
        this.dbName = dbName;
    }

    find = (collection: string, filter: any) => new Promise<any[]>((resolve, reject) => {
        if (this.dbConnection) {
            return resolve(this.dbConnection.db(this.dbName).collection(collection).find(filter).toArray());
        }
        reject("There is not database connection");
    });

    close = () => new Promise<void>((resolve) => {
        if (this.dbConnection) {
            return this.dbConnection.close(true);
        }
        resolve();
    });

    save = (collection: string, data: object[]) => new Promise<any>((resolve, reject) => {
        if (data.length < 1) {
            return resolve(null);
        }
        if (this.dbConnection) {
            return resolve(this.dbConnection.db(this.dbName).collection(collection).insertMany(data));
        }
        reject("There is not database connection");
    });

    private connect = async (url: string) => {
        this.dbConnection = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    }

}