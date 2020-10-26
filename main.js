window.onload = () => {
    gameContainer = document.getElementById("game-container")
    horizontalAmount = gameContainer.clientWidth / 20;
    verticalAmount = gameContainer.clientHeight / 10;
    gameContainer.style.gridTemplateColumns = `repeat(${horizontalAmount * 2}, 10px [col-start])`;
    gameContainer.style.gridTemplateRows = `repeat(${verticalAmount * 2}, 10px [col-start])`;
    for (let j = 0; j < verticalAmount; j++) {
        for (let i = 0; i < horizontalAmount; i++) {
            let el = document.createElement('div');
            let el2 = document.createElement('div');
            el.className = j % 2 === 0 ? "dark-square square" : "square";
            el2.className = j % 2 === 0 ? "square" : "dark-square square";
            gameContainer.appendChild(el);
            gameContainer.appendChild(el2)
        }
    }
    gridWidth = Math.floor(gameContainer.clientWidth / 50);
    gridHeight = Math.floor(gameContainer.clientHeight / 50);
    bs = document.getElementById("body-square");
    headX = (Math.floor(gridWidth / 2))
    headY = (Math.floor(gridHeight / 2))
    bs.style.left = `${50 * headX + 3}px`;
    bs.style.top = `${50 * headY + 3}px`;
    sc = document.getElementById("sprite-container");
    food = document.getElementById("food-square");
    generateFood();
    scWidth = gridWidth * 50;
    scHeight = gridHeight * 50
    sc.style.width = `${scWidth}px`;
    sc.style.height = `${scHeight}px`;
    marginVertical = (gameContainer.clientHeight - gridHeight * 50) / 2 - 2;
    marginHorizontal = (gameContainer.clientWidth - gridWidth * 50) / 2 - 2;
    sc.style.margin = `${marginVertical}px ${marginHorizontal}px`;
}

moving = false;
direction = undefined;
lastIndex = 0;
bodyParts = undefined;
moveInterval = undefined;
directionUsed = false;

move = () => {
    bodyParts = document.getElementsByClassName("body-square");
    bs = bodyParts[lastIndex];
    lastIndex++
    if (lastIndex > bodyParts.length - 1) lastIndex = 0
    tail = bodyParts[lastIndex]
    switch (direction) {
        case "down":
            newPos = parseInt(bs.style.top.slice(0, -2)) + 50;
            if (newPos > scHeight - 47) {
                newPos = 3
            }
            headY = Math.floor(newPos / 50);
            tail.style.top = `${newPos}px`;
            tail.style.left = bs.style.left;
            break;
        case "left":
            newPos = parseInt(bs.style.left.slice(0, -2)) - 50;
            if (newPos < 3) {
                newPos = scWidth - 47;
            }
            headX = Math.floor(newPos / 50);
            tail.style.left = `${newPos}px`;
            tail.style.top = bs.style.top;
            break;
        case "up":
            newPos = parseInt(bs.style.top.slice(0, -2)) - 50;
            if (newPos < 3) {
                newPos = scHeight - 47;
            }
            headY = Math.floor(newPos / 50);
            tail.style.top = `${newPos}px`;
            tail.style.left = bs.style.left;
            break;
        case "right":
            newPos = parseInt(bs.style.left.slice(0, -2)) + 50;
            if (newPos > scWidth - 47) {
                newPos = 3
            }
            headX = Math.floor(newPos / 50);
            tail.style.left = `${newPos}px`;
            tail.style.top = bs.style.top;
            break;
    }
    for (let i = 0; i < bodyParts.length; i++) {
        if (i !== lastIndex && bodyParts.item(i).style.top === tail.style.top && bodyParts.item(i).style.left === tail.style.left) {
            clearInterval(moveInterval);
            endText = document.getElementById("end-text")
            endText.style.visibility = "unset";
            endText.lastChild.textContent += bodyParts.length
        }
    }
    if (headX === x && headY === y) {
        newBodyPart = document.createElement("div");
        newBodyPart.className = "body-square";
        sc.appendChild(newBodyPart);
        newBodyPart.style.left = bs.style.left;
        newBodyPart.style.top = bs.style.top;
        generateFood()
    }
    directionUsed = true;
}

startMoving = () => {
    moving = true;
    moveInterval = setInterval(move, 200);
}

generateFood = () => {
    possible = false
    while (!possible) {
        possible = true;
        x = Math.round(Math.random() * (gridWidth - 1))
        y = Math.round(Math.random() * (gridHeight - 1))
        topStyle = `${(y * 50) + 3}px`;
        leftStyle = `${(x * 50) + 3}px`;
        if (bodyParts)
            for (let i = 0; i < bodyParts.length; i++) {
                if (bodyParts.item(i).style.top === topStyle && bodyParts.item(i).style.left === leftStyle) possible = false
            }
    }
    food.style.top = topStyle;
    food.style.left = leftStyle;
}

window.onkeydown = (e) => {
    if (directionUsed && (direction === "down" && e.key === "ArrowUp") || (direction === "up" && e.key === "ArrowDown") || (direction === "left" && e.key === "ArrowRight") || (direction === "right" && e.key === "ArrowLeft"))
        return
    direction = e.key.match(/Arrow(.+)/)[1].toLowerCase();
    directionUsed = false;
    if (!moving) {
        startMoving();
    }
}