const fastify = require("fastify");
const server = fastify();

server.register(require('fastify-cors'), { 
    origin: "*"
});

const announcements = require("./announcements");
const dailytimetable = require("./dailytimetable");
const timetable = require("./timetable");
const userinfo = require("./userinfo");

server.get("/", () => "Server up and running!");

function wrapper(func) {
    return (req, res) => {
        return func();
    };
}

server.get("/api/dailynews/list.json", wrapper(announcements));
server.get("/api/timetable/daytimetable.json", wrapper(dailytimetable));
server.get("/api/timetable/timetable.json", wrapper(timetable));
server.get("/api/details/userinfo.json", wrapper(userinfo));

server.get("/resources", async (req, res) => {
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

server.post("/auth", async (req, res) => {
    return {};
});

server.listen(8080, "::");