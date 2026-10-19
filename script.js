
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let oldTime = null;
let requestId;

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other){
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    subtract(other){
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    scale(scaler){
        return new Vector2(this.x * scaler, this.y * scaler);
    }
    crossSv(scaler){
        return new Vector2(-this.y * scaler, this.x * scaler);
    }
    dot(other){
        return this.x * other.x + this.y * other.y;
    }
    cross(other){
        return this.x * other.x - this.y * other.y;
    }
    rotate90CW(){
        return new Vector2(this.y,-this.x);
    }
}

class DrawObject {
    constructor(points,color="#000"){
        this.basePoints = [...points];
        this.points = [];
        this.color = color;
    }

    updatePoints(position, rotation) {
        this.points = this.basePoints.map(point => {
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);

            return new Vector2(
                point.x * cos - point.y * sin,
                point.x * sin + point.y * cos
            ).add(position);
        });
    }

    draw(){
        let polygonPoints = this.points;
        if (polygonPoints.length < 3) return;

        ctx.beginPath();
        
        ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
        
        for (let i = 1; i < polygonPoints.length; i++) {
            ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
        }
        
        ctx.closePath(); 
        
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class PhysicsObject extends DrawObject{
    constructor(x,y,mass,points) {
        super(points);
        this.position = new Vector2(x,y);
        this.velocity = new Vector2(0,0);
        this.rotation = 0;
        this.angularVelocity = 0
        this.mass = mass;
        this.momentOfInertia = 3000;
        super.updatePoints(this.position,this.rotation);
    }

    step(dt) {
        this.rotation += this.angularVelocity * dt;
        this.position = this.position.add(this.velocity.scale(dt));
        super.updatePoints(this.position,this.rotation);
    }

    applyImpulse(impluse, worldPoint){
        const r = worldPoint.subtract(this.position);
        const angularImpluse = r.cross(impluse);

        this.velocity = this.velocity.add(impluse.scale(1 / this.mass));
        this.angularVelocity += angularImpluse / this.momentOfInertia;
    }
}

class PhysicsWorld {
    constructor() {
        this.objects = [];
        this.gravity = new Vector2(0,10);
    }

    step(dt) {
        this.objects.forEach(object =>{
            object.velocity = object.velocity.add(this.gravity.scale(dt));
        });

        this.objects.forEach(object =>{
            object.step(dt);
        });
    }
}

world = new PhysicsWorld();
world.objects.push(new PhysicsObject(100,100,1,[new Vector2(-20,-20),new Vector2(-20,20),new Vector2(20,20),new Vector2(20,-20)]))

function update(timestamp) {
    const dt = oldTime === null ? 0: Math.min((timestamp - oldTime) / 1000, 0.05);

    oldTime = timestamp;

    world.step(dt);
    draw();

    requestId = requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = "#090";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    world.objects.forEach(object => {
        object.draw();
    });
}

let mousePos = new Vector2(0,0);

window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mousePos.x = x;
    mousePos.y = y;
});


window.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.code === 'Space') {
        console.log("here");
        world.objects[0].applyImpulse(mousePos.subtract(world.objects[0].position),mousePos);
        
        event.preventDefault(); 
    }
});

requestId = requestAnimationFrame(update);