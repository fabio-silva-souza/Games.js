document.addEventListener('DOMContentLoaded', () => {

    const start_btn = document.querySelector('button')
    const score_display = document.querySelector('span');
    const field = document.querySelector('.field');
    const mini_field = document.querySelector('.mini-field')
    
    for(let i = 0; i < 200; i++){
        let square = document.createElement('div');
        field.append(square);
    }
    for(let i = 0; i < 10; i++){
        let floor = document.createElement('div');
        floor.classList.add('floor');
        field.append(floor);
    }
    for(let i = 0; i < 16; i++){
        let mini = document.createElement('div');
        mini_field.append(mini)
    }
    
    let squares = Array.from(document.querySelectorAll('.field div'));
    let nextRandom = 0;
    let score = 0;
    let timerId;

    const width = 10;

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
    
    const zTetromino = [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1]
    ];
    
    const tTetromino = [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1]
    ];
    
    const oTetromino = [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1]
    ];
    
    const iTetromino = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    function draw() {
        current.forEach( index => {
            squares[currentPosition + index].classList.add('block')
        })
    }

    function undraw() {
        current.forEach( index => {
            squares[currentPosition + index].classList.remove('block')
        })
    }

    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        
        if(!isAtLeftEdge) currentPosition -=1;
        
        if(current.some(index => squares[currentPosition + index].classList.contains('floor'))) {
            currentPosition +=1;
        }
        draw();
    }
    
    function rotate() {
        undraw();
        currentRotation ++;
        if ( currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
        
        if (!isAtRightEdge) currentPosition += 1;
        
        if (current.some(index => squares[currentPosition + index].classList.contains('floor'))) {
            currentPosition -=1;
        }
        draw();
    }
    
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
  
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('floor'))) {
        
            current.forEach( index => squares[currentPosition + index].classList.add('floor'))
    
            random = nextRandom
            nextRandom  = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    const display_blocks = document.querySelectorAll('.mini-field div');
    const display_width = 4
    let display_index = 0

    const smallTetrominoes = [
        [1, display_width+1, display_width*2+1, 2] //lTetromino
        [0, display_width, display_width+1, display_width*2+1], //zTetromino
        [1, display_width, display_width+1, display_width+2],  //tTetromino 
        [0, 1, display_width, display_width+1], //oTetromino 
        [1, display_width+1, display_width*2+1, display_width*3+1] //iTetromino
    ];

    function displayShape() {
        display_blocks.forEach( block => {
            block.classList.remove('block')
        })

        smallTetrominoes[nextRandom].forEach( index => {
            display_blocks[display_index + index].classList.add('block')
        })
    }

    start_btn.addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId)
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape();
        }
    })

    function addScore() {
        for (let i = 0; i < 200; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            
            if(row.every(index => squares[index].classList.contains('floor'))) {
                score += 10;
                
                score_display.innerHTML = score;
        
                row.forEach(index => {
                    squares[index].classList.remove('floor');
                    squares[index].classList.remove('block')
            
                    const squares_removed = squares.splice(i, width);
                    squares = squares_removed.concat(squares)
                    squares.forEach(cell => field.appendChild(cell))
                })
            }
        }
    }


    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('floor'))) {
            score_display.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
})