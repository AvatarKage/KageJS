import { createExpressServer, createViteServer } from "../packages/server/index.js";

const server = createExpressServer({
    port: 3000
});

server.use(logger());
server.use(cors());
server.use(json());

server.group("/api", (api) => {
    api.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });

    api.group("/users", (users) => {
        users.get("/", getUsers);
        users.get("/:id", getUser);
        users.post("/", createUser);
    });
});

await server.start();

await server.restart({
    reason: "",
    trigger: ""
});

await server.stop();
