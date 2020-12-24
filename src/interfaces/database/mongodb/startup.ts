import { exec } from "child_process";

console.log("Starting DB...");
exec(`${process.env.DATABASE_STARTUP_COMMAND}`, (err, stdout, stderr) => {
    if (err) {
        return console.error(err);
    }
    if (stderr) {
        return console.error(stderr);
    }
    console.log(stdout.toString());
});
console.log("DB started");