const fastify = require("fastify");
const server = fastify();

const announcements = require("./announcements");
const dailytimetable = require("./dailytimetable");
const timetable = require("./timetable");
const userinfo = require("./userinfo");

server.get("/", () => "Server up and running!");

server.get("/api/dailynews/list.json", announcements);
server.get("/api/timetable/daytimetable.json", dailytimetable);
server.get("/api/timetable/timetable.json", timetable);
server.get("/api/details/userinfo.json", userinfo);

server.get("/all.json", async () => {
    var expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    var termination = new Date();
    //90 Days
    termination.setHours(termination.getHours() + 90 * 24);

    return {
        result: {
            announcements: await announcements(),
            dailytimetable: await dailytimetable(),
            "next-dailytimetable": await dailytimetable(),
            timetable: await timetable(),
            userinfo: userinfo()
        },
        token: {
            access_token: "",
            refresh_token: "",
            expiry: expiry.toISOString(),
            termination: termination.toISOString()
        }
    };
});

server.listen(8080, "::");