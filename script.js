const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var oldTime = 0;

let requestId;

var objects = [];

class DrawObject {
    constructor(position, size, color = "#000") {
        this.drawPos = [Math.round(position[0]),Math.round(canvas.height - position[1])];
        this.drawSize = size;
        this.color = color;
    }

    updateDrawPos(position){
        this.drawPos = [Math.round(position[0]),Math.round(canvas.height - position[1])];
    }
}

class PhysicsObject extends DrawObject {
    constructor(position, size, velocity = [0, 0], acceleration = [0, 0], color = "#000") {
        super(position, size, color);

        this.position = [...position];
        this.velocity = [...velocity];
        this.acceleration = [...acceleration];
    }

    updatePhysics(dt) {
        this.velocity[0] += this.acceleration[0] * dt;
        this.velocity[1] += this.acceleration[1] * dt;

        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;

        super.updateDrawPos(this.position);
    }
}

class Rect extends PhysicsObject {
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.drawPos[0],this.drawPos[1],this.drawSize[0],this.drawSize[1]);
    }
}

objects.push(new Rect([100,400],[50,50],[10,0],[0,-10]));

function update(timestamp) {
    console.log(timestamp)
    let dt = (timestamp - oldTime)/1000;
    oldTime = timestamp;
    updateObjects(dt);

    draw();

    requestId = requestAnimationFrame(update);
}

function updateObjects(dt){
    objects.forEach(object => {
        object.updatePhysics(dt);
    });
}

function draw(){
    ctx.fillStyle = "#090";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawObjects();
}

function drawObjects(){
    objects.forEach(object => {
        object.draw();
    });
}

requestId = requestAnimationFrame(update);