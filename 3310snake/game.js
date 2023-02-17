document.addEventListener('DOMContentLoaded', () => {
    
    for(var i = 0; i <= 399; i++){
        const square = document.createElement('div');
        document.querySelector('.field').append(square);
    }
    const score_display = document.querySelector('span');
    const squares = document.querySelectorAll('.field div');
    // const start_btn = document.querySelector('.start');
    
    
    const width = 20;

    let currentIndex = 0;
    let currentSnake = [2,1,0];
    let appleIndex = 0;
    let direction = 1;
    let score = 0;
    let speed = 0.9;
    let intervalTime = 0;
    let interval = 0;

    function startGame() {
        currentSnake.forEach(index => squares[index].classList.remove('snake'));
        squares[appleIndex].classList.remove('apple');
        clearInterval(interval);
        intervalTime = 1000;

        randomApple();
        
        direction = 1;
        currentSnake = [2,1,0];
        currentIndex = 0;
        score = 0;
        score_display.innerText = score;
        
        currentSnake.forEach(index => squares[index].classList.add('snake')); 
        interval = setInterval(moveComes, intervalTime);
    }

    function moveComes(){
        hitting();
        gettingApple();
    }

    function hitting() {
        if ( (currentSnake[0] + width >= (width * width) && direction === width) || //hits bottom
             (currentSnake[0] % width === width -1 && direction == 1) || //rigth wall
             (currentSnake[0] % width === 0 && direction === -1) || //left wall
             (currentSnake[0] - width < 0 && direction === -width) || //hits top
             squares[currentSnake[0] + direction].classList.contains('snake')) //goes itsleft

            return clearInterval(interval);
    }

    function gettingApple() {
        const tail = currentSnake.pop();
        squares[tail].classList.remove('snake');
        currentSnake.unshift(currentSnake[0] + direction);
       
        if (squares[currentSnake[0]].classList.contains('apple')) 
        {
            squares[currentSnake[0]].classList.remove('apple');
            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            randomApple();
            
            score++;
            score_display.textContent = score;
            
            clearInterval(interval);
            intervalTime = intervalTime * speed;
            interval = setInterval(moveComes, intervalTime);
        }
        squares[currentSnake[0]].classList.add('snake');
    }

    function randomApple(){
        do {
            appleIndex = Math.floor(Math.random() * squares.length)
           } 
        while(squares[appleIndex].classList.contains('snake'));
        squares[appleIndex].classList.add('apple');
    }

    function control(e) {
        squares[currentIndex].classList.remove('snake');// we are removing the class of snake from All the squares

        if(e.keyCode === 39) {
            direction = 1 //right arrow on our keyboard 
        } else if (e.keyCode === 38) {
            direction = -width //up arrow, the snake will go back 20 divs,
        } else if (e.keyCode === 37) {
            direction = -1 // left 
        } else if (e.keyCode === 40) {
            direction = +width //down
        }
    }

    document.addEventListener('keyup', control);
    document.querySelector('.start').addEventListener('click', startGame);
})