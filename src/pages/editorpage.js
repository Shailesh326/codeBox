import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS, { SYNC_CODE } from "../Actions";
import Client from "./components/Client";
import Editor from "./components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const Editorpage = () => {
  const socketRef = useRef(null); // useRef is react hook that stores data tha is availble for multiple render and most importantly change in that will not re-render the componenet
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  

  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket(); //after this statement client will get connected to server
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err)); //for error handling

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed , try again later");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username, //this question mark is for error handling it will not show error if user name is not found
      });
      // Listening for joined events
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId != socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }; // cleaning function used to clear the listner as if not cleared problem of memory leak arise
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id has been copied to your clipboard");
    } catch (err) {
      toast.error("could not copy the Room Id");
      console.log(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  // component to redirect if any error occured
  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo"></img>
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default Editorpage;
