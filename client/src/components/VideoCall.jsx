import Header from "./Header";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './VideoCall.css'

const VideoCall = () => {
  const videoPeerRef = useRef(null);
  const videoSelfRef = useRef(null);
  const loaderRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const lsRef = useRef(null);
  const nextButtonRef = useRef(null);
  const startButtonRef = useRef(null);
  const stopButtonRef = useRef(null);
  

  useEffect(() => {
    videoPeerRef.current.addEventListener('play', () => {
      loaderRef.current.style.display = 'none';
    });
    nextButtonRef.current.disabled = true; 
    startButtonRef.current.disabled = false; 
    stopButtonRef.current.disabled = true;
  }, []);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8080');

    wsRef.current.init = function () {
      this.channels = new Map();
      this.addEventListener('message', (message) => {
        const { channel, data } = JSON.parse(message.data.toString());
        this.propagate(channel, data);
      });
    };

    wsRef.current.emit = function (channel, data) {
      this.send(JSON.stringify({ channel, data }));
    };

    wsRef.current.register = function (channel, callback) {
      this.channels.set(channel, callback);
    };

    wsRef.current.propagate = function (channel, data) {
      const callback = this.channels.get(channel);
      if (!callback) return;
      callback(data);
    };

    return () => {
      wsRef.current.close();
    };
  }, []);

  const initializeConnection = useCallback(async () => {
    const iceConfig = {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    };

    pcRef.current = new RTCPeerConnection(iceConfig);
    pcRef.current.sentDescription = false;

    pcRef.current.onicecandidate = (e) => {
      if (!e.candidate) return;

      if (!pcRef.current.sentRemoteDescription) {
        pcRef.current.sentRemoteDescription = true;
        wsRef.current.emit('description', pcRef.current.localDescription);
      }
      wsRef.current.emit('iceCandidate', e.candidate);
    };

    pcRef.current.oniceconnectionstatechange = async function () {
      if (
        pcRef.current.iceConnectionState === 'disconnected' ||
        pcRef.current.iceConnectionState === 'closed'
      ) {
        console.log(pcRef.current.iceConnectionState);
        pcRef.current.close();
        initializeConnection();
      }
    };

    const rs = new MediaStream();

    videoPeerRef.current.srcObject = rs;
    loaderRef.current.style.display = 'inline-block'; // show loader

    lsRef.current.getTracks().forEach((track) => {
      console.log('adding tracks');
      pcRef.current.addTrack(track, lsRef.current);
    });

    pcRef.current.ontrack = (event) => {
      console.log('received track');
      event.streams[0].getTracks().forEach((track) => {
        rs.addTrack(track);
      });
    };

    await new Promise(r => setTimeout(r, 2000));
    // wsRef.current.emit('peopleOnline');
    wsRef.current.emit('match');
  });

  useEffect(() => {
    const handleWebSocketOpen = async () => {
      wsRef.current.init();

      wsRef.current.register('begin', async () => {
        const offer = await pcRef.current.createOffer();
        pcRef.current.setLocalDescription(offer);
        // signalRemotePeer({ description: pcRef.localDescription });
      });

      wsRef.current.register('iceCandidate', async (data) => {
        pcRef.current.addIceCandidate(data);
      });

      wsRef.current.register('description', async (data) => {
        await pcRef.current.setRemoteDescription(data);
        if (!pcRef.current.localDescription) {
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
        }
      });

      wsRef.current.register('disconnect', async () => {
        console.log('received disconnect request');
        pcRef.current.close();
        initializeConnection();
      });

      try {
        lsRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (e) {
          alert('This website needs video and audio permission to work correctly');
        }
        videoSelfRef.current.srcObject = lsRef.current;
        loaderRef.current.style.display = 'none';
        // await initializeConnection();
      };

      wsRef.current.addEventListener('open', handleWebSocketOpen);

      return () => {
        if (pcRef.current && wsRef.current) {
          wsRef.current.close();
          pcRef.current.close();
        }
      };
    }, [initializeConnection]);

    const stopConnection = () => {
      if (pcRef.current && wsRef.current) {
        wsRef.current.emit("disconnect");
        pcRef.current.close();
        loaderRef.current.style.display = 'none';
      }
    };

    const skipConnection = async () => {
      if (pcRef.current && wsRef.current) {
        wsRef.current.emit("disconnect");
        pcRef.current.close();
        await initializeConnection();
      }
    }

    const startConnection = async () => {
      await initializeConnection();
    } 

    const handleNext = async () => {
      nextButtonRef.current.disabled = false; 
      startButtonRef.current.disabled = true; 
      stopButtonRef.current.disabled = false;
      await skipConnection()
    }

    const handleStart = async () => {
      nextButtonRef.current.disabled = false; 
      startButtonRef.current.disabled = true; 
      stopButtonRef.current.disabled = false;
      await startConnection()
    }

    const handleStop = () => {
      nextButtonRef.current.disabled = true; 
      startButtonRef.current.disabled = false; 
      stopButtonRef.current.disabled = true;
      stopConnection()
    }

    return (
      <div className="h-screen w-screen bg-gray-100">
        <Header/>
        <div id="main">
          <div id="top-bar">
            <div id="top-right">
              <div id="peopleOnline">
              </div>
            </div>
          </div>
          <div id="videos">
            <div id="self">
              <video
                className="video-player"
                id="video-self"
                autoPlay
                playsInline
                muted
                ref={videoSelfRef}
              ></video>
            </div>
            <div id="peer">
              <video
                className="video-player"
                id="video-peer"
                autoPlay
                playsInline
                ref={videoPeerRef}
              ></video>
              <div id="peer-video-loader" ref={loaderRef}></div>
            </div>
          </div>
          <div className="btn-action">
            <button ref={nextButtonRef} onClick={handleNext} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed">
              Next
            </button>
            <button ref={startButtonRef} onClick={handleStart} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed">
              Start
            </button>
            <button ref={stopButtonRef} onClick={handleStop} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed">
              Stop
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default VideoCall;