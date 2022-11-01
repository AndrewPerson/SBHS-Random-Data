#!/usr/bin/env node

import { fastify } from "fastify";
const server = fastify();

import fastifyCors from "@fastify/cors";

server.register(fastifyCors, { 
    origin: "*"
});

import announcements from "./announcements.js";
import dailytimetable from "./dailytimetable.js";
import timetable from "./timetable.js";
import userinfo from "./userinfo";

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

server.listen({
    port: 8080
});