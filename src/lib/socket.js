import { API_URL } from "@/services/constants";
import { io } from "socket.io-client";

const SOCKET_URL = API_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
});
