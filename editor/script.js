fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'students' })  // Send a request to get crash type data
    })
        //convert the response to json
        .then(response => response.json())
        //then do something with the data
        .then(data => {
            console.log(data)
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "image.png";

// console.log(bg);

// document.body.appendChild(bg)

const points = []

function update() {
    requestAnimationFrame(update)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 100, 100);

    ctx.beginPath();

    for (const point of points) {
        ctx.moveTo(point[0], point[1]);
        ctx.arc(point[0], point[1], 10, 0, Math.PI*2);
    }

    ctx.fill();
}

requestAnimationFrame(update)

canvas.addEventListener("click", (e) => {
    console.log(e.clientX - 300, e.clientY - 50);
    points.push([e.clientX - 300, e.clientY - 50]);
})