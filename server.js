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

server.listen(8080, "::");