import { MongoClient } from "mongodb";

const uri = `${process.env.DATABASE_URI}:${process.env.DATABASE_PORT}/`;

MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    console.log(`Database '${process.env.DATABASE_NAME}' created!`);
    const dbo = db.db(`${process.env.DATABASE_NAME}`);
    ['events', 'gists'].forEach((collection) => {
        dbo.createCollection(collection, function (err, _res) {
            if (err) {
                db.close();
                throw err;
            };
            console.log(`Collection '${collection}' created!`);
            db.close();
        });
    });
});