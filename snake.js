
    const squareSize = 22;
    const noRows = floor(height / squareSize);
    const noCols = floor(width / squareSize);

        let speedDelay = 100;

        let dx = 1;
        let dy = 0;

        let segments = [];

        let food;

        let bestScore = 0;
        let score = 0;

        let lastUpdate;
        let lastEat;

        let displayOpen = true;

        let crashed = false;

            init();

            frameRate(60);

                function init()
                    {
                        background('MintCream');
                        music('Polka Train', 0.1);

                        if (score > bestScore)
                            bestScore = score;

                            crashed = false;
                            score = 0;
                            lastEat = Date.now();

                            dx = 1;
                            dy = 0;
    
                            segments = [];
                            grow();
    
                            addFood();
                    }

                function loop()
                    {
                        update();
                        display();
                    }

                function update()
                    {
                        if (crashed)
                            {
                                if (keyIsDown(82)) // R
                                    init();

                                    return;
                            }

                        checkKeys();
                        updateSnake();
                        checkEat();
                        checkCollision();
                    }

function display()
{
    clear();

    displayArena();
    displaySnake();
    displayFood();
    displayStats()

    if (crashed)
    {
        fill("black");
        textSize(20);
        text("You crashed!", 350, 300);
        
        textSize(12);
        text("Press R to restart game", 345, 325);
        
        if (score > bestScore && displayOpen)
        {
            fill("teal");
            text("You have a new best score!", 335, 365);
        }
        
        music("");
    }
}

function updateSnake()
{
    if (segments.length === 0)
        return;

    if (Date.now() - lastUpdate < speedDelay)
        return;

    lastUpdate = Date.now();
    
    // implement snake update / move, similar to grow
    
    // when snake is moving is growing towards head and drops the tail
    let row = segments[0].row + dy;
    let col = segments[0].col + dx;

    let newSegment = { row, col };
    segments.unshift(newSegment);

    // remove last segment
    segments.pop();
}

function checkKeys()
{
    if (keyIsDown(LEFT_ARROW))
    {
        dx = -1;
        dy = 0;
    }
    
    else if (keyIsDown(RIGHT_ARROW))
    {
        dx = 1;
        dy = 0;
    }

    else if (keyIsDown(UP_ARROW))
    {
        dx = 0;
        dy = -1;
    }

    else if (keyIsDown(DOWN_ARROW))
    {
        dx = 0;
        dy = 1;
    }
}

function displaySnake()
{
    displaySnakeHead();
    for(let i = 1; i < segments.length; i++)
    {
        displaySnakeSegment(i);
    }
}

function displaySnakeSegment(no)
{
    noStroke();
    fill("teal");

    let segment = segments[no];

    let x = segment.col * squareSize;
    let y = segment.row * squareSize;
    let r = squareSize / 2;

    circle(x + squareSize / 2, y + squareSize / 2, r);
}

function displaySnakeHead()
{
    noStroke();
    fill("teal");

    let x, y, a1, a2;
    let segment = segments[0];
    
    x = segment.col * squareSize + squareSize / 2;
    y = segment.row * squareSize + squareSize / 2;

    if (dx === 1 && dy === 0)
    {
        a1 = 30;
        a2 = 330;
    }

    else if (dx === -1 && dy === 0)
    {
        a1 = 210;
        a2 = 150;
    }

    else if (dy === -1 && dx === 0)
    {
        a1 = 300;
        a2 = 240;
    }

    else if (dy === 1 && dx === 0)
    {
        a1 = 120;
        a2 = 60;
    }

    if (frameCount % 10 === 0)
        displayOpen = !displayOpen;

    if (!displayOpen)
    {
        a1 = 0;
        a2 = 359;
    }

    arc(x, y, squareSize, squareSize, a1, a2);
}


function grow()
{
    let row = 0;
    let col = 0;

    if (segments.length > 0)
    {
        row = segments[0].row + dy;
        col = segments[0].col + dx;
    }
    
    // A new segment (e.g. head) is added at the beginning of the 
    // array (e.g. snake) in the direction that is moving
    let newSegment = { row, col };
    segments.unshift(newSegment);
}

function addFood()
{
    let row = randomInt(0, noRows - 1);
    let col = randomInt(0, noCols - 1);
    
    food = { row, col }
}

function displayFood()
{
    fill("red");
    noStroke();
    
    let x = food.col * squareSize;
    let y = food.row * squareSize;
    
    let d = 3 * sin(frameCount);

    rect(x + 3 + d, y + 3 + d, squareSize - 5 - d * 2, squareSize - 5 - d * 2);
}

function checkEat()
{
    if ( segments[0].row === food.row &&

        segments[0].col === food.col )
    {
        updateScore();
        lastEat = Date.now();
        sound("pepSound1");

        grow();
        addFood();
    }
}

function updateScore()
{
    // Get a score multiplication factor "> 1" if eat food in less than 10 seconds
    function getScoreMultiplication()
    {
        let norm = 10000;
        let delta = Date.now() - lastEat
        
        if (delta > norm)
            return 1;
            
        return floor((norm - delta) / 1000);
    }
    
    // Score is updated based on snake length and multiplication factor
    let deltaScore = segments.length * 10 * getScoreMultiplication();
    
    // Add more to the score if food was close to the wall
    if (food.row === 0 || food.row === noRows - 1 ||
        food.col === 0 || food.col === noCols - 1)
        deltaScore *= 1.5;
        
    score += floor(deltaScore);
}

function checkCollision()
{
    let head = segments[0];
    
    // Check collisions with walls
    if (head.row < 0 || head.row >= noRows ||
        head.col < 0 || head.col >= noCols)
    {
        crashed = true;
        return;
    }
    
    // Check collisions with body segments
    for(let i = 1; i < segments.length; i++)
    {
        let segment = segments[i];
        
        if (head.row === segment.row && 
            head.col === segment.col)
        {
            crashed = true;
            return;
        }
    }
}

function displayArena()
{
    noFill();

    stroke("black");
    rect(0, 0, noCols * squareSize, noRows * squareSize);

    stroke("DarkSeaGreen");
    
    for(let row = 0; row < noRows; row++)
    {
        line(0, row * squareSize, noCols * squareSize, row * squareSize);
    }
    
    for(let col = 0; col < noCols; col++)
    {
        line(col * squareSize, 0, col * squareSize, noRows * squareSize);
    }
}

function displayStats()
{
    fill("black");
    
    textSize(12);
    text("Use arrow keys to change snake direction!", 10, height - 10);
    text("Best Score: " + bestScore, width / 2, height - 10);
    text("Score: " + score, width - 100, height - 10);
}
