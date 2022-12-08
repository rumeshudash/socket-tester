import io, { Socket } from "socket.io-client";
import { GLOBAL_CONFIG } from "../Constants/api.constants";

let socket: Socket | null;

export class SocketUtil {
    static connect(url?: string, callback: () => void = () => {}) {
        const endpoint = url || GLOBAL_CONFIG.SOCKET_URL;

        socket = io(endpoint, { transports: ["websocket"] });
        socket.on("connect", () => {
            callback();
            console.log(`connected to socket ${endpoint}`);
        });
        socket.on("disconnect", (reason) => {
            socket = null;
            console.log("disconnected: ", reason);
        });
    }

    static emit(event: string, value: any) {
        if (!socket || !socket.connected) return;

        socket.emit(event, value);
    }

    static listen(event: string, callback: (_: any) => void) {
        if (!socket || !socket.connected) return;
        socket.on(event, callback);
    }

    static disconnect() {
        if (!socket || !socket.connected) return;
        socket.disconnect();
    }
}
