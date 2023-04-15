// fonction JS qui va etre lancé lorsque la fenêtre va être affiché
window.onload = function () { // evenement onload

    const canvasWidth = 900
    const canvasHeight = 600;
    const blockSize = 30;
    let ctx;
    let delay = 100;

    let snakee;
    let applee;

    const widthInBlocks = canvasWidth / blockSize; // nb de blocs dans le canvas dans la longueur
    const heghtInBlocks = canvasHeight / blockSize; // nb de blocs dans le canvas dans la hauteur

    let score; // score du joueur
    let timeout;



    init();


    function init() {
        // canvas element HTML5 qui permet de dessiner dans la page HTMLL

        // creation du canvas
        const canvas = document.createElement('canvas') // attribue a la constiable canvas un element sur notre page HTML en utilisant une fonction qui s'appelle createElement et on lui met le type canvas 
        canvas.width = canvasWidth; // largeur du canvas (px)
        canvas.height = canvasHeight; // hauteut du canvas (px)
        canvas.style.border = "30px solid gray"; // rajoute un bordure au canvas a partir de la propriété border qui se touve dans style
        canvas.style.margin = " 50px auto"; // centrer le canvas
        canvas.style.display = "block"; // le display doit etre de type block 
        canvas.style.backgroundColor = "#ddd" // change la couleur de fond
        document.body.appendChild(canvas) // attache le canvas à la page HTML appenchild permet d'attacher un tag au body
        ctx = canvas.getContext('2d'); // contexte du canvas qu'on a créer en spécifiant sa dimension
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3,4],[2,4]], "right"); // parametre = body + direction
        applee = new Apple([10,10]);
        score = 0;

        refreshCanvas();
        

    }

    function refreshCanvas() {

        snakee.advance();
        if(snakee.checkCollision()){ // regarde s'il y a des collisions
            gameOver();
        }else{
            if(snakee.isEatingApple(applee)){
                score ++;
                snakee.ateApple = true;
                do  // repositionner tant que pomme sur le serpent // si pas sur le serpent passer a la suite
                {
                    applee.setNewPosition(); //le serpent a mangé la pomme

                }
                while(applee.isOnSnake(snakee)); // vérifier la position de la pomme
            }
      
            ctx.clearRect(0, 0, canvasWidth, canvasHeight) // efface tout le canvas
            drawScore();

            snakee.draw();
            applee.draw();

            timeout = setTimeout(refreshCanvas, delay);
        }
    }

    function gameOver()
    {
        ctx.save(); // enregistrer les parametres de configurations du contexte du canvas (couleur ect)
        ctx.font = "bold 70px sans-serif" // changement du style du score
        ctx.fillStyle = "black" // couleur du score
        ctx.textAlign = "center" // centrer le score
        ctx.textBaseline = "middle"; // le bas est au centre
        const centreX = canvasWidth/2; // centre X
        const centreY = canvasHeight/2; // centre Y
        ctx.strokeStyle = "white"; // couleur de la bordure
        ctx.lineWidth = 5; // taille de la bordure
        ctx.strokeText("GAME OVER",centreX,centreY-180); // affiche le stroke
        ctx.fillText("GAME OVER",centreX,centreY-180); // affiche game over sur l'écran
        ctx.font = "bold 30px sans-serif" // changement du style du score
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer",centreX,centreY-120); // affiche le stroke
        ctx.fillText("Appuyer sur la touche Espace pour rejouer",centreX,centreY -120); 
        ctx.restore()
    }

    function restart()
    {
        snakee = new  Snake([[6, 4], [5, 4], [4, 4], [3,4],[2,4]], "right"); // parametre = body + direction
        applee = new Apple([10,10]);
        score=0;
        clearTimeout(timeout); // stoppe l'ancien processus
        refreshCanvas();
    }

    function drawScore()
    {
        ctx.save(); // enregistrer les parametres de configurations du contexte du canvas (couleur ect)
        ctx.font = "bold 200px sans-serif" // changement du style du score
        ctx.fillStyle = "gray" // couleur du score
        ctx.textAlign = "center" // centrer le score
        ctx.textBaseline = "middle"; // le bas e st au centre
      
        const centreX = canvasWidth/2; // centre X
        const centreY = canvasHeight/2; // centre Y

        ctx.fillText(score.toString(),centreX,centreY); // affiche game over sur l'écran
        ctx.restore()
    }

    function drawBlock(ctx, position) { // position d'un bloc (défini par un array avec comme 1 ere élément x et 2 eme element un y)
        const x = position[0] * blockSize; // en pixels (position * la taille du bloc)
        const y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) { // prototype du serpent
        this.body = body; // corps du serpent
        this.direction = direction; // direction du serpent
        this.ateApple = false; // le serpent a mangé une pomme
        this.draw = function () // méthode qui dessine le corps du serpent dans notre Canvas (chacun de ses blocs)
        {
            ctx.save(); // sauvegarder le contexte du contexte (contenu) comme il était avant que je rentre dans la fonction
            ctx.fillStyle = "#ff0000"; // couleur du contexte

            // chaque bloc du corps du serpent sera un aray avec deux valeurs (1ere : x, 2eme : y)
            // le serpent est un ensemble de petits blocs (Array composé d'array :  [ [5,3], [6,] ] )
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]); // dessine les blocs du serpent
            }
            ctx.restore(); // remttre le contexte comme il était avant après avoir dessiné sur le contexte
        };
        this.advance = function () {
            const nextPosition = this.body[0].slice(); // copie l'element [6,4] de l'array

            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1; // eneleve x de 1
                    break;
                case "right":
                    nextPosition[0] += 1; // augmente x de 1
                    break;
                case "down":
                    nextPosition[1] += 1; // augmente y de 1
                    break;
                case "up":
                    nextPosition[1] -= 1; // eneleve y de 1
                    break;
                default:
                    throw("Invalid Direction");
            }

            this.body.unshift(nextPosition); // rajouter un element a la premiere place
            if(!this.ateApple){ // si le serpent n'a pas mangé de pomme
                this.body.pop(); // enleve le dernier element du body
            }
            else{
                this.ateApple=false; // on remet la valeur manger une pomme a 0
            }
        };
        this.setDirection = function(newDirection){
            let allowedDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];        
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];          
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1){ // direction permise // indexOf : retourne l'emplacement ou y a l'element donc si superiru à 0 present
                this.direction = newDirection;
            }
        };
        this.checkCollision = function(){
            let wallCollision = false; // colilision avec un mur
            let snakeCollision = false; // serpent passe sur lui même
            const head = this.body[0]; // tête du serpent que l'on vérifie
            const rest = this.body.slice(1); // reste du serpent
            const snakeX = head[0]; // x de la tête
            const snakeY = head[1]; // y de la tête
            const minX = 0; // min du canvas x
            const minY = 0; // min du canvas y
            const maxX = widthInBlocks-1; // max du canvas en bloc x 
            const maxY = heghtInBlocks-1; // max du canvas en bloc y
            const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX // vérifie collision mur x
            const isNotBetweenVertitalWalls = snakeY < minY || snakeY > maxY // vérifir collision mur y

            if(isNotBetweenHorizontalWalls || isNotBetweenVertitalWalls){ // si pas dans le canvas alors colission
                wallCollision = true;
            }

            for(let i = 0; i < rest.length; i++){ // vérifie collision serpent
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;          
        };

        this.isEatingApple = function(appleToEat){
            let eat = false;
            const head = this.body[0]; // tête du serpent que l'on vérifie
            const snakeX = head[0]; // x de la tête
            const snakeY = head[1]; // y de la tête

            if(snakeX === appleToEat.position[0] && snakeY === appleToEat.position[1])
            {
                eat = true;
            }
            return eat;
 
        };
        // this.speed() = function(){
            
            
        // }

          

    }

    function Apple(position){ // prototype de la pomme
        this.position = position; // position de la pomme
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath(); // vider les anciens chemins (cercle ici)
            const radius = blockSize / 2; // le rayon est agale à un bloc divisé par 2
            const x = this.position[0]*blockSize + radius; // on veut le point x qui est le centre du cercle
            const y = this.position[1]*blockSize + radius; // on veut le point x qui est le centre du cercle
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function()
        {
            const newX = Math.round(Math.random()* widthInBlocks -1); // Math.random (chiffre entre 0 et 1)
            const newY = Math.round(Math.random()* heghtInBlocks -1); // Math.round donne un arrondi
            this.position = ([newX,newY]);
        }
        this.isOnSnake = function(snakeToCheck){
            const isOnSnake = false;

            for(let i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
            
        };
    }

    document.onkeydown = function handleKeyDown(e) { // onKeydown : quand l'utilisateur appuie sur une touche de son clavier
        const key = e.keyCode; // chaque touche appuyée à un code donnée par l'event donne le code de la touche qui a été appuyée
        let newDirection;
        switch(key){
            case 37:
                newDirection = "left"
                break;
            case 38:
                newDirection = "up"
                break;
            case 39:
                newDirection = "right"

                break;
            case 40:
                newDirection = "down"
                break;
            case 32:
                restart(); // fonction qui remet a jour le jeu
                return;
            default:
                return; // ne continue pas la fonction on s'arrete on retourne
        }
        snakee.setDirection(newDirection);

    }
}



