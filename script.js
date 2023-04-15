window.onload = function(){

    const canvas;
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const ctx;
    const delay = 100;
    const xMin = 0;
    const yMin = 0;

    const widthInBlocks = canvasWidth / blockSize; // nb de blocs dans le canvas dans la longueur
    const heghtInBlocks = canvasHeight / blockSize; // nb de blocs dans le canvas dans la hauteur
    const xMax = widthInBlocks - 1;
    const yMax = heghtInBlocks - 1;
    const snakee;
    const applee;

    const score;


    init();


    function init()
    {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        document.body.appendChild(canvas);

        ctx = canvas.getContext("2d");

        snakee = new Snake([ [6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10, 10]);
        score = 0;

        refreshCanvas();
    }

    function refreshCanvas(){
        snakee.advance();
        if(snakee.checkCollision()){
            gameOver();
        }
        else{
            if(snakee.eatApple(applee)){
                score++;
                snakee.ate = true;
                do{
                    applee.setNewPosition();

                }while(applee.isOnSnake(snakee));
            }
            ctx.clearRect(0,0, canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            drawScore();
            setTimeout(refreshCanvas,delay)
        }
        
    }

    function gameOver()
    {
        ctx.save();
        ctx.fillText("Game Over",5,15);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer",5,30);
        ctx.restore();
    }

    function restart()
    {
        snakee = new Snake([ [6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10, 10]);
        refreshCanvas();
    }

    function drawScore()
    {
        ctx.save();
        ctx.fillText("Score : "+ score,5,canvasHeight-5);
        ctx.restore();
    } 
    

    function drawBlock(ctx, position)
    {
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;

        ctx.fillRect(x, y, blockSize, blockSize);
    }

    


    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ate = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(const i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            const nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                default:
                    throw("Invalid direction");
            }

            this.body.unshift(nextPosition);
            if(!this.ate){
                this.body.pop();
            }
            else{
                this.ate = false;
            }

        }
        this.setDirection = function(newDirection)
        {
            const allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
            }
            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        }
        this.checkCollision = function()
        {
            const wallCollision = false;
            const snakeCollision = false;

            const head = this.body[0];
            const rest = this.body.slice(1);
            const snakeX = head[0];
            const snakeY = head[1];

        
            
            const isNotBetweenHorizontalWalls = snakeX < xMin || snakeX > xMax;
            const isNotBetweenVerticalWalls = snakeY < yMin || snakeY > yMax;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }

            for(const i=0; i < rest.length; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;
        };

        this.eatApple = function (appleToEat){
            const eat = false;
            const head = this.body[0];
            const snakeX = head[0];
            const snakeY = head[1];
            if(snakeX === appleToEat.position[0] && snakeY === appleToEat.position[1]){
                eat = true;
            }
            return eat;
        }

    }


    function drawCircle(ctx, position)
    {
        const radius = blockSize / 2;
        const x = position[0] * blockSize + radius;
        const y = position[1] * blockSize + radius;
        ctx.arc(x, y, radius, 0, Math.PI*2,true);
        ctx.fill();
    }

    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            drawCircle(ctx, this.position);
            ctx.restore();
        };
        this.setNewPosition = function(){
            const newX = Math.round(Math.random()*xMax)
            const newY = Math.round(Math.random()*yMax)
            this.position = ([newX,newY]);
        };
        this.isOnSnake = function (snakeToCheck){
            const isOnSnake = false;
            for(const i=0; i < snakeToCheck.body.length;i++){
                if(this.position[0] ===snakeToCheck.body[i][0] && this.position[0] ===snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    document.onkeydown = function handleKeyDown(e)
    {
        const key = e.keyCode;
        const newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
            default:
                return;
        }
        snakee.setDirection(newDirection);

    }

}