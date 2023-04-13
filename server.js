#!/usr/bin/env node
import yargs from "yargs";
import fetch from 'node-fetch';
import { readFile } from "fs/promises"

const argv = yargs(process.argv.slice(2)).argv


import { fastify } from "fastify";
const server = fastify();

import fastifyCors from "@fastify/cors";

server.register(fastifyCors, { 
    origin: "*"
});

import announcements from "./announcements.js";
import dailytimetable from "./dailytimetable.js";
import timetable from "./timetable.js";
import userinfo from "./userinfo.js";

server.get("/", () => "Server up and running!");

function wrapper(func) {
    return (req, res) => {
        return func();
    };
}

function read(filePath) {
    const file = readFile(filePath, "utf-8").then(file => JSON.parse(file));

    return (req, res) => {
        return file;
    }
}

if (argv.announcements) server.get("/api/dailynews/list.json", read(argv.announcements))
else server.get("/api/dailynews/list.json", wrapper(announcements));

if (argv.dailytimetable) server.get("/api/timetable/daytimetable.json", read(argv.dailytimetable))
else server.get("/api/timetable/daytimetable.json", wrapper(dailytimetable));

if (argv.timetable) server.get("/api/timetable/timetable.json", read(argv.timetable))
else server.get("/api/timetable/timetable.json", wrapper(timetable));

if (argv.userinfo) server.get("/api/details/userinfo.json", read(argv.userinfo))
else server.get("/api/details/userinfo.json", wrapper(userinfo));

server.post("/api/token", (req, res) => {
    return {
        access_token: "",
        refresh_token: "",
        expires_in: 3600,
    }
});

server.listen({
    port: argv.port ?? 8080
});