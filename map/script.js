
// use henry's timetable 
import { currentLessons, hovered, lessonColours } from "../henry/new/timetable.js";

// get and setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// fetch the background
const bg = new Image();
bg.src = "image.png";

// manages the view of the map
const camera = { x: 0, y: 0, zoom: 1 };
const tcamera = { x: 0, y: 0, zoom: 1 };

// the expected size of the map in pixels
const dimensions = { width: 2122, height: 1478 };

// last update frame time
let lastTime = 0;

// get the map select dropdown
const mapSelect = document.getElementById("mapSelect");

// the list of rooms currently rendering on the map
const rooms = [];

// use the api to get a list of all the maps in the database
async function getMaps() {
    return await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'maps' })
    })
        .then(response => response.json())
}

// fetch all maps, then add them to the dropdown, and load the first one
async function updateMapList() {
    const maps = await getMaps(); // get all maps

    mapSelect.innerHTML = ""; // reset the dropdown

    // for each map, add a new option to the select element
    for (const map of maps) {
        const option = document.createElement("option");
        option.value = map.id;
        option.textContent = map.name;
        mapSelect.appendChild(option);
    }

    // load the first map
    mapSelect.value = maps[0].id;
    loadMap(maps[0].id)
}

// when the user selects a new map, load it
mapSelect.onchange = () => {
    loadMap(mapSelect.value)
}

// initially, fetch the map list
updateMapList();

// given the id of map, fetch it's contents from the api, and then load it's contents
async function loadMap(id) {
    // use the api to get the data for the map, with the map id
    const roomsData = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'rooms', map_id: id })  // Send a request to get all the rooms with the map id
    })
        //convert the response to json
        .then(response => response.json())
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));

    if (!roomsData) return; // if there is no data or the map didn't exist, return

    // clear the rooms on the map
    rooms.length = 0;

    // for each room in in the data, add it to the map
    for (const room of roomsData) {
        rooms.push({ name: room.room_name, points: JSON.parse(room.points), id: room.room_id, hovered: 0, colour: null })
    }
}

// runs each frame
function update(timestamp) {
    requestAnimationFrame(update) // runs this function next frame

    // get the difference in time between this frame and the last (for animations)
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // animate camera
    camera.x = lerp5(camera.x, tcamera.x, dt * 25);
    camera.y = lerp5(camera.y, tcamera.y, dt * 25);
    camera.zoom = lerp5(camera.zoom, tcamera.zoom, dt * 25);

    // resize canvas
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // apply camera transform
    ctx.save();
    ctx.translate(-camera.x * camera.zoom, -camera.y * camera.zoom);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(canvas.width / 2 / camera.zoom, canvas.height / 2 / camera.zoom);

    // draw background
    ctx.drawImage(bg, -dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height);

    // take data from henry's timetable, and determine if a lesson is hovered in the timetable
    const hoveredRoom = (hovered.v != null && currentLessons[hovered.v]) ? currentLessons[hovered.v][6] : null

    let hoverCentre = null;

    // for each room, render it, and handle hovering
    let i = 0;
    for (const room of rooms) {
        // first, determine the bounds of the room for position calculations 
        const min = [null, null];
        const max = [null, null];

        for (const point of room.points) {
            min[0] = min[0] != null ? Math.min(min[0], point[0]) : point[0];
            min[1] = min[1] != null ? Math.min(min[1], point[1]) : point[1];

            max[0] = max[0] != null ? Math.max(max[0], point[0]) : point[0];
            max[1] = max[1] != null ? Math.max(max[1], point[1]) : point[1];
        }

        // the room is hovered if it's id matches the one from henry's timetable
        const isHovered = hoveredRoom == room.id;
        // grab the index in henry's timetable for this lesson using the room id
        const index = currentLessons.findIndex(lesson => lesson != null && lesson[6] == room.id);

        // set the colour of the room using lesson data
        room.colour = lessonColours[index];

        // animate hovering
        room.hovered = lerp5(room.hovered, isHovered ? 1 : (index != -1 ? 0.6 : 0), dt * 15);

        // render room points and lines
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        let start = true;
        for (const point of room.points) {
            if (start) {
                ctx.moveTo(point[0], point[1])
            } else {
                ctx.lineTo(point[0], point[1])
            }
            start = false;
        }
        ctx.lineTo(room.points[0][0], room.points[0][1]);

        ctx.setLineDash([])

        ctx.globalAlpha = room.hovered * 0.8;
        ctx.fillStyle = room.colour;
        ctx.fill();

        ctx.globalAlpha = 1;

        ctx.lineWidth = 5 + 5 * room.hovered;
        ctx.strokeStyle = room.colour;
        ctx.stroke();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.beginPath();
        for (const point of room.points) {
            ctx.moveTo(point[0], point[1]);
            ctx.arc(point[0], point[1], 5, 0, Math.PI * 2);
        }
        ctx.fillStyle = "black";
        ctx.fill();

        i++;

        // if the room is complete, calculate the centre of it, and draw a label
        if (room.points.length > 2) {
            // get the centre from the middle of the bounds
            const centre = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2];

            // if hovered, indicate to move the camera to the centre of the room
            if (isHovered) {
                hoverCentre = centre;
            }

            // render label
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.strokeText(room.name, ...centre);
            ctx.fillText(room.name, ...centre);
        }
    }

    // if a room is hovered, and the camera is not already over it, set it's target position to the room centre
    if (hoverCentre && Math.hypot(camera.x - hoverCentre[0], camera.y - hoverCentre[1]) > 100) {
        const diff = [camera.x - hoverCentre[0], camera.y - hoverCentre[1]]
        const l = Math.hypot(...diff);
        const closest = [hoverCentre[0] + diff[0] / l * 100, hoverCentre[1] + diff[1] / l * 100];
        tcamera.x = lerp5(tcamera.x, closest[0], dt * 10);
        tcamera.y = lerp5(tcamera.y, closest[1], dt * 10);
    }

    ctx.restore();
}

// start the animation loop
requestAnimationFrame(update)

// stores mouse coordinates and left click down
const mouse = { x: 0, y: 0, down: false }
const moved = { x: 0, y: 0 }

// grab the position of the mouse
canvas.addEventListener("mousedown", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    mouse.down = true;
})

// grab the position of the mouse, move camera if it's down
canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    if (mouse.down) {
        const dx = e.movementX / camera.zoom;
        const dy = e.movementY / camera.zoom;
        camera.x -= dx;
        camera.y -= dy;
        tcamera.x -= dx;
        tcamera.y -= dy;
        moved.x -= e.movementX;
        moved.y -= e.movementY;
    }

})

// grab the position of the mouse
canvas.addEventListener("mouseup", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    mouse.down = false;

    // const d = Math.hypot(moved.x, moved.y);
    moved.x = 0;
    moved.y = 0;
})

// if zooming, zoom camera, otherwise, pan camera
canvas.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
        const f = Math.max(1 - e.deltaY / 50, 0);

        const lastZoom = tcamera.zoom;
        tcamera.zoom *= f;

        const dx = e.offsetX - canvas.width / 2;
        const dy = e.offsetY - canvas.height / 2;

        tcamera.x += dx / lastZoom - dx / tcamera.zoom;
        tcamera.y += dy / lastZoom - dy / tcamera.zoom;
    } else {
        tcamera.x += e.deltaX / tcamera.zoom;
        tcamera.y += e.deltaY / tcamera.zoom;
    }
    e.preventDefault();
}, { passive: false })

//

// animation smoothing functions
function lerpn(
    start,
    end,
    multiply,
    step,
) {
    multiply = 1 - (1 - multiply) ** step;
    if (multiply > 1) multiply = 1;
    if (multiply < 0) multiply = 0;
    return start + (end - start) * multiply;
}

function lerp5(start, end, step) {
    return lerpn(start, end, 0.5, step);
}