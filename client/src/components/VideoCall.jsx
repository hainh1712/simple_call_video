import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function VideoCall() {
  const authInfo = useAuth();
  const { user } = authInfo;
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  const myVideo = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    // if (connectionRef.current) {
    //   connectionRef.current.destroy();
    // }
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center w-4/5 mx-auto">
        <div className="flex flex-row gap-32">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="video">
              {stream && (
                <video
                  className="rounded-lg w-full h-full"
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  // style={{ width: "300px", height: "300px" }}
                />
              )}
            </div>
            {/* <span className="text-red-500 font-bold text-lg mb-4">{caller}</span> */}
            {/* <div className="info-person1 flex items-center justify-center my-2">
              <div className="mr-2">
                <img src={user?.avatar_url ? user.avatar_url : "/social-media.png"} alt="icon" width={36} height={36}></img>
              </div>
              <div>
                <span>{user.name}</span><br/>
                <span>Lớp: {user.classname} - {user.grade}</span>
              </div> 
            </div> */}
            <p className="text-red-500">{me}</p>
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            {callAccepted && !callEnded ? (
              <>
                <video
                  className="rounded-lg w-full h-full"
                  playsInline
                  ref={userVideo}
                  autoPlay
                  // style={{ width: "300px", height: "300px" }}
                />
                {/* <div className="info-person2 flex items-center justify-center my-2">
                  <div className="mr-2">
                    <img src={user?.avatar_url ? user.avatar_url : "/social-media.png"} alt="icon" width={36} height={36}></img>
                  </div>
                  <div>
                    <span>{user.name}</span><br/>
                    <span>Lớp: {user.classname} - {user.grade}</span>
                  </div> 
                </div> */}
                <span className="text-red-500 font-bold text-lg mb-4">{caller}</span>
              </>        
            ) : (
              <div className="flex flex-col justify-center items-center">
                <img
                  src="https://w0.peakpx.com/wallpaper/416/423/HD-wallpaper-devil-boy-in-mask-red-hoodie-dark-background-4ef517.jpg"
                  className="rounded-lg"
                  alt="User Avatar"
                  style={{ width: "400px", height: "400px" }}
                />
                {/* <div className="info-person2 flex items-center justify-center my-2">
                  <div className="mr-2">
                    <img src={user?.avatar_url ? user.avatar_url : "/social-media.png"} alt="icon" width={36} height={36}></img>
                  </div>
                  <span>{callingUser || 'Đang tìm kiếm'}</span>
                </div> */}
                <span className="text-red-500 font-bold text-lg">{idToCall}</span>
              </div>
            )}
          </div>
        </div>
        <textarea 
          className="text-black"
          value={idToCall}
          onChange={(e) => {
            setIdToCall(e.target.value);}}
        />
        <div>
          {callAccepted && !callEnded ? (
            <button className="text-white hover:text-blue-100 font-bold rounded-md m-4 px-2 bg-[#D57658]" onClick={leaveCall}>
              Stop
            </button>
          ) : (
            <button
              className="text-white hover:text-blue-100 font-bold rounded-md m-4 px-2 bg-[#50B58D]"
              onClick={() => callUser(idToCall)}
            >
              Start
            </button>
          )}
        </div>
        <div className="text-red-500">
          {receivingCall && !callAccepted ? (
            <div className="caller flex flex-col">
              <h1 className="text-red-500">{caller} is calling...</h1>
              <button
                className="text-black text-xl hover:text-gray-400 mr-6 font-bold bg-white rounded-md m-4 px-2"
                onClick={answerCall}
              >
                Answer
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;

