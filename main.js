const moves = [
    {
        name: 'pedra',
        emoji: '✊',
        beats: 'tesoura'
    },
    {
        name: 'papel',
        emoji: '✋',
        beats: 'pedra'
    },
    {
        name: 'tesoura',
        emoji: '✌️',
        beats: 'papel'
    }
];

const x = ' × ';

const score = [0, 0];
function addScore(n) {
    if (isNaN(n) || n >= score.length) return;
    score[n]++;
    document.getElementById('scoreboard').innerText = score.join(x);
}

const msgHistory = [];
class Msg {
    clear() {
        msgHistory.splice(0, msgHistory.length);
        document.getElementById('textarea').innerHTML = '';
        return this;
    }
    write(...msgs) {
        msgs.forEach(msg => {
            msgHistory.push(msg);
            document.getElementById('textarea').innerHTML += (msgHistory.length > 1 ? '<br>' : '') + msg;
        });
        return this;
    }
}
const msg = new Msg();

moves.forEach(move => {
    const button = document.createElement('button');
    button.id = move.name;
    button.title = capitalize(move.name);
    button.innerText = move.emoji;
    document.getElementById('buttons').appendChild(button);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function select(el) {
    play();
    el.classList.add('active');
    sleep(moves.length * 1000).then(() => {
        el.classList.remove('active');
        result(el.id);
    });
}

moves.forEach(move => {
    const el = document.getElementById(move.name);
    el.addEventListener('click', () => select(el) );
    el.addEventListener('keyup', e => { if (e.code == 'Space') select(el) });
});

function play() {
    msg.clear();
    moves.forEach((move, i) => {
        document.getElementById(move.name).disabled = true;
        sleep(i * 1000).then(() => msg.write(capitalize(move.name) + (i + 1 == moves.length ? '!' : '...')));
        sleep(moves.length * 1000).then(() => document.getElementById(move.name).disabled = false);
    });
}

function result(selection) {
    const playerMove = moves.find(move => move.name == selection);
    const opponentMove = moves[randomNum()];
    console.log(playerMove, opponentMove);
    msg.clear().write(playerMove.emoji+x+opponentMove.emoji);
    switch (opponentMove.name) {
        case playerMove.beats:
            msg.write('Vitória!');
            addScore(0);
            break;
        case playerMove.name:
            msg.write('Empate!');
            break;
        default:
            msg.write('Derrota!');
            addScore(1);
            break;
    }
}

function randomNum(num = moves.length) {
    return Math.floor(Math.random() * num);
}
