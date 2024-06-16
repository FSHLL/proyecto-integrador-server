import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    },
});

io.listen(3001);

const characters = [];
let crosses = [];

const generateRandomPosition = () => {
    return [Math.random() * 3, 0, Math.random() * 3];
};

io.on("connection", (socket) => {
    console.log("user connected");

    characters.push({
        id: socket.id,
        position: generateRandomPosition(),
    });

    io.emit("characters", characters);
    io.emit("cross-positioned", crosses);

    socket.on("player-moving", (transforms) => {
        io.emit("player-moving", {
            id: socket.id,
            ...transforms
        });
    });

    socket.on("cross-positioned", (position) => {
        crosses.push({
            id: socket.id,
            position: position
        })
        io.emit("cross-positioned", crosses);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");

        characters.splice(
            characters.findIndex((character) => character.id === socket.id),
            1
        );
        io.emit("characters", characters);

        crosses = crosses.filter((c) => c.id !== socket.id)
        io.emit("cross-positioned", crosses);
    });
});
