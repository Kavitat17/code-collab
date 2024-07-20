import { io } from 'socket.io-client';

// this function is giving us client ka socket instance
export const initSocket = async () => {
    // hamare socket connection ke options
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    return io(process.env.REACT_APP_BACKEND_URL, options);
};
