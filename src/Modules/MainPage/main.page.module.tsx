import { useEffect, useState } from "react";
import Terminal, { TerminalOutput } from "react-terminal-ui";
import { GLOBAL_CONFIG } from "../../Constants/api.constants";
import { SocketUtil } from "../../Utils/socket.utils";

const MainPageModule = () => {
    const [room, setRoom] = useState<string>();
    const [log, setLog] = useState<any[]>([]);

    useEffect(() => {
        SocketUtil.connect(GLOBAL_CONFIG.SOCKET_URL, () => {
            SocketUtil.listen("log", (data) => {
                console.log("log data", data);
                setLog((prev) => [...prev, data]);
            });
        });

        return () => {
            SocketUtil.disconnect();
        };
    }, []);

    const handleConnect = () => {
        if (!room) return;
        SocketUtil.emit("join_room", { room });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "950px",
                    margin: "50px auto",
                }}
            >
                <div>
                    <input
                        type="text"
                        placeholder="Join Room"
                        value={room || ""}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button onClick={handleConnect}>Join Room</button>
                </div>

                <Terminal
                    name="React Terminal Usage Example"
                    // colorMode={ColorMode.Light}
                >
                    {log.map((logData, index) => {
                        return (
                            <TerminalOutput key={index}>
                                {">"} {logData}
                            </TerminalOutput>
                        );
                    })}
                </Terminal>
            </div>
        </div>
    );
};

export default MainPageModule;
