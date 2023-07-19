import React, { useRef, useState, useEffect } from "react";

import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./components/Draw";

import * as fp from "fingerpose";
import rock_img from "./images/rock.png";
import paper_img from "./images/paper.png";
import scissors_img from "./images/scissors.png";
import think_img from "./images/think.png";
import { RockGesture, PaperGesture, ScissorsGesture } from './components/GameGestures';

// MUI Style
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Sheet from '@mui/joy/Sheet';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import SocialMedia from "./components/SocialMedia";
import ModalMessage from "./components/ModalMessage";
import LoadingState from "./components/LoadingState";
import CamModal from "./components/CamModal";

tf.setBackend('webgl');
function App() {
  const [loadingState, setLoadingState] = useState(true);
  const [emoji, setEmoji] = useState(null);
  const [playerImage, setPlayerImage] = useState(null);
  const [cpuImage, setCpuImage] = useState(null);
  const [counter, setCounter] = useState(5);
  const [startGame, setStartGame] = useState(false);
  const [pauseGame, setPauseGame] = useState(false);
  const [cpuScore, setCpuScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [holdPlayer, setHoldPlayer] = useState(false);
  const [message, setMessage] = useState('Click Start Button');
  const [webcamVisibility, setWebcamVisibility] = useState(false);
  const [totalRounds, setTotalRounds] = useState(3);
  const [roundSelectedValue, setRoundSelectedValue] = useState('3 Round');
  const [openModal, setOpenModal] = useState(false);
  const [askCamPermission, setAskCamPermission] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const startBtn = useRef(null);
  const pauseBtn = useRef(null);
  const resumeBtn = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    // console.log("Handpose model loaded.");
    setTimeout(() => {
      setLoadingState(false);
    }, 1000);
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      /////////GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          RockGesture,
          PaperGesture,
          ScissorsGesture,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 9);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.score
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          // console.log(gesture.gestures[maxConfidence].name);
          setEmoji(String(gesture.gestures[maxConfidence].name));
          // console.log(gesture.gestures[maxConfidence]);
          // console.log(emoji);
        }
      }

      /////////GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  // Set Player Image
  useEffect(() => {
    if (holdPlayer) {
      return
    }

    if (emoji === 'rock') {
      setPlayerImage(rock_img);

    } else if (emoji === 'paper') {
      setPlayerImage(paper_img);

    } else if (emoji === 'scissors') {
      setPlayerImage(scissors_img);

    }
  }, [emoji, holdPlayer]);

  // Set CPU Image

  const handleCPUImage = (num) => {
    // CPU = Rock
    if (num === 1) {
      if (playerImage === paper_img) {
        setPlayerScore((prev) => prev + 1);
        setMessage('Player Wins!!')

      } else if (playerImage === scissors_img) {
        setCpuScore((prev) => prev + 1);
        setMessage('CPU Wins!!')

      } else if (playerImage === rock_img) {
        setMessage('Round Draw!!')

      } else {
        setMessage("Player didn't make any choice.")
      }
      setCpuImage(rock_img)

      // CPU = Paper
    } else if (num === 2) {
      if (playerImage === scissors_img) {
        setPlayerScore((prev) => prev + 1);
        setMessage('Player Wins!!')

      } else if (playerImage === rock_img) {
        setCpuScore((prev) => prev + 1);
        setMessage('CPU Wins!!')

      } else if (playerImage === paper_img) {
        setMessage('Round Draw!!')

      } else {
        setMessage("Player didn't make any choice.")
      }
      setCpuImage(paper_img)


      // CPU = Scissors
    } else if (num === 3) {
      if (playerImage === rock_img) {
        setPlayerScore((prev) => prev + 1);
        setMessage('Player Wins!!')

      } else if (playerImage === paper_img) {
        setCpuScore((prev) => prev + 1);
        setMessage('CPU Wins!!')

      } else if (playerImage === scissors_img) {
        setMessage('Round Draw!!')

      } else {
        setMessage("Player didn't make any choice.")
      }
      setCpuImage(scissors_img)


    }
  }

  const decrementCounter = () => {
    setCounter((prevCounter) => prevCounter - 1);
  };

  useEffect(() => {
    // Return if game is paused
    if (pauseGame) {
      return
    }

    // Exit the countdown if the counter is already 0
    if (counter === 0) {

      setTotalRounds((prev) => prev - 1)

      setHoldPlayer(true);
      let randomNumber = Math.floor(Math.random() * 3) + 1;
      handleCPUImage(randomNumber);

      setTimeout(() => {
        setCounter(5);
        setHoldPlayer(false);
      }, 3000);

      return
    };

    // While Countdown...
    setCpuImage(think_img);

    if (totalRounds === 0) {
      setStartGame(false);
      setOpenModal(true);
      setMessage('Click Start Button')
      setTotalRounds(Number(String(roundSelectedValue).match(/\b\d{1,2}\b/g)));

      startBtn.current.style.pointerEvents = 'auto';
      startBtn.current.style.opacity = '1';

      return
    }

    // Start the countdown interval
    let interval = null;
    if (startGame && totalRounds > 0) {
      setMessage('Calculating...');
      interval = setInterval(decrementCounter, 1000);
    }

    // Clean up the interval when the component unmounts or when the counter reaches 0
    return () => {
      clearInterval(interval);
    }
  }, [counter, startGame, pauseGame]); // Only re-run the effect if the 'counter' state changes


  useEffect(() => {
    runHandpose();
    resumeBtn.current.style.pointerEvents = 'none';
    resumeBtn.current.style.opacity = '0.5';

  }, []);


  return (
    <div className="App">
      {loadingState && <LoadingState />}
      <div className="main-container">
        {/* My Social Links */}
        <SocialMedia />
        <CamModal askCamPermission={askCamPermission} setAskCamPermission={setAskCamPermission} />
        <ModalMessage totalRounds={totalRounds} cpuScore={cpuScore} playerScore={playerScore} openModal={openModal} setOpenModal={setOpenModal} />

        <div className="left-container">
          {/* Score Board */}
          <div className="score-board">
            <div className="heading-container">
              <h2 className="score-heading">Score</h2>
              <hr className="score-hr" />
            </div>
            <div className="score-content-container">

              <ul className="score-content">
                <li>
                  Player:
                  <span>{playerScore ? playerScore : 0}</span>
                </li>
                <li>
                  CPU:
                  <span>{cpuScore ? cpuScore : 0}</span>
                </li>
                <br />
                <li className="msg-container-lg" style={{ justifyContent: 'center', marginTop: '20px' }}>
                  <span>{message}</span>
                </li>
              </ul>

              <div className="left-controls">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: window.innerWidth < 520 ? 'column' : 'row',
                    gap: 2,
                    width: '100%',
                    justifyContent: 'center',
                    '& > div': { p: '10px', borderRadius: 'xs', display: 'flex' },
                  }}
                >
                  <Sheet variant="outlined"
                    sx={{
                      bgcolor: '#151515',
                      border: '1px solid #d7d7d7',
                      '&:hover': {
                        bgcolor: '#d7d7d7',
                        border: '1px solid #151515',
                      }
                    }}>
                    <Checkbox
                      onChange={() => setWebcamVisibility((prevValue) => !prevValue)}
                      size="sm"
                      style={window.innerWidth < 520 ? { fontSize: '.7rem' } : null}
                      sx={{
                        color: '#d7d7d7',
                        '&:hover': { color: '#151515' }, textTransform: 'uppercase', fontWeight: '700'
                      }} overlay label="Video" />
                  </Sheet>

                  <Select onChange={(elm) => {
                    setTotalRounds(Number(String(elm.target.innerHTML).match(/\b\d{1,2}\b/g)));
                    setRoundSelectedValue(elm.target.innerHTML)
                  }}
                    size="sm"
                    disabled={startGame ? true : false}
                    slotProps={{
                      listbox: {
                        placement: 'top',
                        sx: {
                          '&>li': { m: '1px 0px' },
                          '&>li[aria-selected="true"]': { bgcolor: '#151515', color: '#d7d7d7' },
                          '&>li:hover': { bgcolor: '#151515', color: '#d7d7d7' },
                        },
                      },
                    }}
                    style={window.innerWidth < 520 ? { fontSize: '.7rem' } : null}
                    sx={{
                      bgcolor: '#151515',
                      color: '#d7d7d7',
                      border: '1px solid #d7d7d7',
                      '&>button': { fontWeight: '700', textTransform: 'uppercase' },
                      '&:hover': { bgcolor: '#d7d7d7', border: '1px solid #151515' },
                      '&:hover>span': { color: '#151515' },
                      '&>span': { color: '#d7d7d7' },
                    }} defaultValue={roundSelectedValue}>
                    <Option value="3 Round">3 Round</Option>
                    <Option value="5 Round">5 Round</Option>
                    <Option value="10 Round">10 Round</Option>
                  </Select>


                </Box>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="cam-canvas-container">
            <Webcam
              onUserMedia={() => { setAskCamPermission(false); }}
              onUserMediaError={() => { setAskCamPermission(true); }}

              style={{ visibility: webcamVisibility ? 'visible' : 'hidden' }}
              ref={webcamRef} className="cam-canvas" />
            <canvas ref={canvasRef} className="cam-canvas" />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="right-container">
          <h1 className="title">Rock Paper Scissors</h1>

          <div className="game-screen">
            <div className="cpu-side">

              <div className="img-container">
                {cpuImage !== null ?
                  <img src={cpuImage} alt="" /> :
                  <img src={think_img} alt="" />
                }
              </div>

              <span>CPU</span>
            </div>

            <div className="vs-side">
              <span>VS</span>
              <span>{counter}</span>
            </div>

            <div className="player-side">

              <div className="img-container">
                {emoji !== null ?
                  <img src={playerImage} alt="" /> :
                  <img src={think_img} alt="" />
                }
              </div>

              <span>PLAYER</span>
            </div>
          </div>

          <div className="msg-container-sm">{message}</div>

          <div className="game-controls">
            <button ref={startBtn} onClick={(elm) => {
              setStartGame(true);
              setCpuScore(0);
              setPlayerScore(0);
              elm.currentTarget.style.opacity = '0.5';
              elm.currentTarget.style.pointerEvents = 'none';
            }} className="action-btn">start</button>

            <button ref={pauseBtn} onClick={(elm) => {
              setPauseGame(true);
              elm.currentTarget.style.opacity = '0.5';
              resumeBtn.current.style.opacity = '1';
              elm.currentTarget.style.pointerEvents = 'none';
              resumeBtn.current.style.pointerEvents = 'auto'
            }} className="action-btn">pause</button>

            <button ref={resumeBtn} onClick={(elm) => {
              setPauseGame(false);
              elm.currentTarget.style.opacity = '0.5';
              pauseBtn.current.style.opacity = '1';
              elm.currentTarget.style.pointerEvents = 'none';
              pauseBtn.current.style.pointerEvents = 'auto';
            }} className="action-btn">resume</button>
            <button onClick={() => window.location.reload()} className="action-btn restart-btn">restart</button>
          </div>
        </div>

      </div>
    </div >
  );
}

export default App;
