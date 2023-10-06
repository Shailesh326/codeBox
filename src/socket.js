
import {io} from 'socket.io-client';


export const initSocket = async() => {
    const options ={
        'force new connection':true, 
        reconnectionAttempt: 'Infinity', //if problem in connection then it can connect infinite times
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL, options);  // process.env.REACT_APP_BACKEND determines which port server is present
    //this function will return instance of client 
};