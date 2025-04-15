import { useState, useEffect, useMemo } from 'react';
import './App.css';
import bg from "./bg.mp4"

function App() {
  const [isIntro, toggleIntro] = useState(true)
  const [botsTurn, toggleBotsTurn] = useState(false)
  const [mainArr, setMainArr] = useState([])
  const [userStreak, setUserStreak] = useState([])
  const [meterVal, setMeterVal] = useState('')
  const [gameOver, reloadGame] = useState(false)
  const [score, setScore] = useState(0); 
  const [countdown, setCountdown] =useState(10)

  useEffect(() => {
    if (botsTurn) {
      setTimeout(() => {
        botsPlay();
      }, 1000);
      setCountdown(0)
    } else {
      setCountdown(10)
      // startCounter()
    }
  }, [botsTurn]);

  useEffect(() => {
    if (gameOver) {
      console.log("Game Over")
    }
  }, [gameOver]);

  function gameOn(e) {
    e.target.classList.add("pressed");
    setTimeout(() => {
      e.target.classList.remove("pressed");
    }, 100);

    const pressedValue = e.target.value;
    setMeterVal(pressedValue)
    console.log("pressedValue", pressedValue)
    if (mainArr.length == 0) {
      setMainArr(prevArr => [...prevArr, pressedValue]);
      toggleBotsTurn(true)
      setScore(prevScore => prevScore + 1);
    } else {
      const userArr = userStreak.concat(pressedValue);
      const sequence = mainArr.slice(0, userArr.length).map(String);
      if (userArr.length > mainArr.length) {
        setMainArr(prevArr => [...prevArr, pressedValue]);
        toggleBotsTurn(true)
        setUserStreak([])
        setScore(prevScore => prevScore + 1);
        return
      }
      const isCorrect = userArr.every((value, index) => value === sequence[index]);
      if (isCorrect) {
        setUserStreak(userArr);
      } else {
        reloadGame("true")
      }
    }
  }
  
  function botsPlay() {
    const sequence = mainArr.slice();
    let index = 0;
  
    function simulateBotTurn() {
      if (index < sequence.length) {
        setTimeout(() => {
          const pressedValue = sequence[index];
          console.log("Bot pressed:", pressedValue);
          setMeterVal(pressedValue);
          const botButton = document.querySelector(`.bot input[value='${pressedValue}']`);
          if (botButton) {
            botButton.classList.add("pressed");
            setTimeout(() => { botButton.classList.remove("pressed"); }, 100);
          }
  
          index++;
          simulateBotTurn();
        }, 500);
      } else {
        const newNumber = Math.floor(Math.random() * 9) + 1;
        console.log("Bot's new number:", newNumber);
  
        setTimeout(() => {
          setMeterVal(newNumber);
          setMainArr(prevArr => [...prevArr, newNumber]);
          toggleBotsTurn(false);
          const botButton = document.querySelector(`.bot input[value='${newNumber}']`);
          if (botButton) {
            botButton.classList.add("pressed");
            setTimeout(() => { botButton.classList.remove("pressed"); }, 100);
          }
        }, 500);
      }
    }
    simulateBotTurn();
  }

  function startCounter(){
    setInterval(()=>{
      if(!botsPlay){
        setCountdown(prevCount => prevCount - 1)
      } else {
        clearInterval()
      }
      if (countdown==0) {
        clearInterval()
        reloadGame("true")
      }
    },1000)
  }
  
  return (
    <div className="App">
      <video id="background-video" loop autoPlay muted>
        <source src={bg} type="video/mp4" />
        <source src={bg} type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      <section>
        <ScoreCard score={score+ " ; Countdown : " + countdown} /> 
        {
          gameOver ?          
            <>
              <Meter meterVal={meterVal} gameOver={gameOver} mainArr={mainArr} userStreak={userStreak} />
              <GameOver /> 
            </> : 
          (isIntro ?
            <Intro isIntro={isIntro} toggleIntro={toggleIntro} /> :
            <>
              {/* <Meter meterVal={meterVal} mainArr={mainArr} userStreak={userStreak} /> */}
              <Meter meterVal={meterVal} gameOver={gameOver} mainArr={mainArr} userStreak={userStreak} />
              <Board gameOn={gameOn} botsTurn={botsTurn} />
            </>
          )
        }
      </section>

    </div>
  );
}

export default App;

function Intro(props) {
  const { isIntro, toggleIntro } = props
  return (
    <div>
      <h1>HI There !!</h1>
      <p>Here is what you gotta do !!!</p>
      <p style={{ margin: "5% 20%" }}>There are two players, <b>You</b> and the <b>Bot</b> with a Number Board. Once you start selecting , you need to keep the old values and sequence as is ... Its basically a memory Game, you'll get it eventually. Go Ahead, Play!!! </p>
      <button className='button-49' onClick={() => toggleIntro(!isIntro)}>Start</button>
    </div>

  )
}

function Meter({ meterVal, gameOver, mainArr, userStreak }) {
  let displayValue = meterVal;
  let className = 'meter-box number-slide-enter';
  if (gameOver) {
    const correctValue = mainArr[userStreak.length] || '';
    displayValue = `${meterVal} (Expected: ${correctValue})`;
    className += ' game-over';
  }
  return (
    <div className='meter'>
      <div className={className}>{displayValue}</div>
    </div>
  );
}

function Board(params) {
  let gameOn = params.gameOn
  let botsTurn = params.botsTurn
  return (
    <div className='gameBoard'>
      <div className={botsTurn ? 'bot highlight' : "bot"}>
        {table()}
      </div>
      <div className={botsTurn ? 'user' : 'user highlight'}>
        {table(gameOn)}
      </div>
    </div>

  )
}

function table(gameOn) {
  const rows = 3;
  const cols = 3;
  const values = Array.from({ length: rows * cols }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5);
  let index = 0;
  console.log("values", values)
  return (
    <table id="number-board">
      <tbody>
        {Array.from({ length: rows }, (_, i) => (
          <tr key={i}>
            {Array.from({ length: cols }, (_, j) => (
              <td key={i * cols + j + 1}>
                <input className='button-53' onClick={gameOn} type="button" value={values[index++]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GameOver(params) {

  return (
    <div className='game-over'>
      <h1> Game Over </h1>
      <button className='button-53' onClick={()=>window.location.reload()}> Play Again</button>
    </div>

  )

}

function ScoreCard({ score }) {
  return (
    <div className="score-card">
      Score: {score}
    </div>
  );
}
