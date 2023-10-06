import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    // to prevent from reloding

    const id = uuidv4();
    setRoomId(id);
    toast.success("Created new roomId");
    console.log(id);
  };

  const joinRoom = () => {
    //check for empty fields
    if (!roomId || !username) {
      toast.error("username and roomid required");
      return;
    }

    //Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) =>{
    // console.log(e.code);   prints the key entered
    if(e.code === "Enter"){
      joinRoom();
    }

  }
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="/code-sync.png" alt="code-sync" />
        <h4 className="mainLabel">Paste invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
            value={roomId}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
            value={username}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            Info you don't have invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💛 by <a href="#">Shailesh</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
