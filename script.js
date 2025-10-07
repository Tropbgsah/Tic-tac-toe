const playBtn = document.getElementById('playBtn');
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('reset');
let turn = 'X';
let board = Array(9).fill('');

const canvas = document.getElementById('winCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const winText = document.getElementById('winText');

const bgMusic = document.getElementById('bgMusic');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');

playBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  gameContainer.style.display = 'flex';
  bgMusic.volume = 0.3;
  bgMusic.play();
});

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.dataset.index;
    if(board[index] === '') {
      board[index] = turn;
      cell.textContent = turn;
      clickSound.currentTime = 0;
      clickSound.play();
      
      const winLine = checkWin();
      if(winLine) {
        winSound.currentTime = 0;
        winSound.play();
        showWin(winLine, turn);
        setTimeout(resetBoard, 2500);
      } else turn = turn === 'X' ? 'O' : 'X';
    }
  });
});

resetBtn.addEventListener('click', resetBoard);

function resetBoard() {
  board.fill('');
  cells.forEach(c => c.textContent = '');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  winText.textContent = '';
  turn = 'X';
}

function checkWin() {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(let combo of combos){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]) return combo;
  }
  return null;
}

function showWin(combo, player){
  winText.textContent = `Player ${player} Wins!`;
  const rects = combo.map(i => cells[i].getBoundingClientRect());
  const x1 = rects[0].left + rects[0].width/2;
  const y1 = rects[0].top + rects[0].height/2;
  const x2 = rects[2].left + rects[2].width/2;
  const y2 = rects[2].top + rects[2].height/2;
  let progress = 0;
  function animateLine(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + (x2-x1)*progress, y1 + (y2-y1)*progress);
    ctx.stroke();
    progress += 0.03;
    if(progress < 1) requestAnimationFrame(animateLine);
    else showConfetti();
  }
  animateLine();
}

function showConfetti(){
  for(let i=0;i<40;i++){
    const conf = document.createElement('div');
    conf.className='confetti';
    conf.style.left = Math.random()*window.innerWidth+'px';
    const size = 5 + Math.random()*10;
    conf.style.width = size+'px';
    conf.style.height = size+'px';
    conf.style.backgroundColor = `hsl(${Math.random()*360},70%,60%)`;
    const duration = 1.5 + Math.random()*2;
    const rotate = Math.random()*360;
    conf.style.animation = `fall ${duration}s linear forwards`;
    conf.style.transform = `rotate(${rotate}deg)`;
    conf.style.zIndex = 1002;
    document.body.appendChild(conf);
    setTimeout(()=>conf.remove(), duration*1000);
  }
}
