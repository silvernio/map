
// get and setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// fetch the background
const bg = new Image();
bg.src = "image.png";

const topOffset = 90; // header size
const sideOffset = 300; // sidebar size

// manages the view of the map
const camera = { x: 0, y: 0, zoom: 1 };
const tcamera = { x: 0, y: 0, zoom: 1 };

// get all the elements in the little room creation popup
const roomManage = document.getElementById("roomManage");
const createRoomBtn = document.getElementById("createRoomBtn");
const cancelRoomBtn = document.getElementById("cancelRoomBtn");
const roomNameInput = document.getElementById("roomNameInput");

// divs for managing popup ui
const roomCreateDIV = document.getElementById("roomCreate");
const roomSelectDIV = document.getElementById("roomSelect");

// get all elements for management of rooms popup
const roomNameEdit = document.getElementById("roomNameEdit");
const roomDeleteBtn = document.getElementById("deleteRoomBtn");

// get the div for displaying the current list of rooms
const roomList = document.getElementById("rooms");

// list of room names
const roomElements = [];

// get the file operation elements
const mapNameInput = document.getElementById("mapName");
const saveBtn = document.getElementById("saveBtn");
const newBtn = document.getElementById("newBtn");
const deleteBtn = document.getElementById("deleteBtn");

// get the div for displaying the list of maps
const mapList = document.getElementById("maps");

// the list of rooms currently rendering on the map
const rooms = [];

// the expected size of the map in pixels
const dimensions = { width: 2122, height: 1478 };

let selectedRoom = null; // currently selected room
let creatingRoom = false; // whether the using is currently creating a new room
let lastTime = 0; // last update frame time

// current open map
let currentMap = null;

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

    mapList.innerHTML = ""; // reset the dropdown

    // for each map, add a new option to the select element
    for (const map of maps) {
        const option = document.createElement("button");
        option.textContent = map.name;
        mapList.appendChild(option);

        // when the option is clicked, load the map
        option.onclick = () => {
            loadMap(map.id);
            currentMap = map.id;
            mapNameInput.value = map.name
        }
    }
}

// initially, fetch the map list
updateMapList();

// update the room elements list with the rooms array
function updateList() {
    roomList.innerHTML = ""; // clear the room elements

    // for each room, create a new room
    let i = 0;
    for (const room of rooms) {
        const e = document.createElement("div");
        e.textContent = room.name;
        roomList.appendChild(e);

        // when the element is clicked, select the room
        const i2 = i;
        e.onclick = () => {
            selectedRoom = i2;
            roomCreateDIV.style.display = "none";
            roomSelectDIV.style.display = "block";

            roomNameEdit.value = room.name;
        }
        i++
    }
}

// convert screen coords to map coords
function canvasToMap(x, y) {
    return [(x + camera.x) / camera.zoom - canvas.width / 2, (y + camera.y) / camera.zoom - canvas.height / 2];
}

// convert map coords to screen coords
function mapToCanvas(x, y) {
    return [(x + canvas.width / 2) * camera.zoom - camera.x, (y + canvas.height / 2) * camera.zoom - camera.y];
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
    ctx.translate(-camera.x, -camera.y);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // draw background
    ctx.drawImage(bg, -dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height);

    // show delete button when a map is currently loaded
    deleteBtn.style.display = currentMap != null ? "block" : "none";
    
    // show the room popup when creating and room or one is selected
    roomManage.style.opacity = (creatingRoom || selectedRoom != null) ? 1 : 0;

    // get the mouse coordinates in map space
    const m = canvasToMap(mouse.x, mouse.y);

    // for each room, render it
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

        room.min[0] = lerp5(room.min[0], min[0], dt * 15);
        room.min[1] = lerp5(room.min[1], min[1], dt * 15);
        room.max[0] = lerp5(room.max[0], max[0], dt * 15);
        room.max[1] = lerp5(room.max[1], max[1], dt * 15);

        // the room is hovered if it's id matches the one from henry's timetable
        const hovered = room.done && !creatingRoom && m[0] >= min[0] && m[0] <= max[0] && m[1] >= min[1] && m[1] <= max[1];
        room.hovered = hovered;
        room.hover = lerp5(room.hover, (hovered || selectedRoom == i) ? 1 : 0, dt * 15);

        // render room points and lines
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if ((creatingRoom && i == rooms.length - 1) || selectedRoom == i) {
            const p = mapToCanvas(room.min[0], room.min[1]);

            const size = roomManage.getBoundingClientRect();

            p[0] = Math.max(p[0], size.width + 20);
            p[1] = Math.max(p[1], 10);
            roomManage.style.right = (canvas.width - p[0] + 10) + "px";
            roomManage.style.top = (p[1] + topOffset) + "px";

            createRoomBtn.disabled = !room.done || roomNameInput.value.length == 0;

            ctx.beginPath();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "black";
            ctx.setLineDash([10, 10]);
            ctx.rect(room.min[0], room.min[1], room.max[0] - room.min[0], room.max[1] - room.min[1]);
            ctx.stroke();
        }

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
        if (room.done) {
            ctx.lineTo(room.points[0][0], room.points[0][1]);
        } else if (creatingRoom && i == rooms.length - 1) {
            ctx.lineTo(...canvasToMap(mouse.x, mouse.y));
        }

        ctx.setLineDash([])

        ctx.lineWidth = 5 + 5 * room.hover;
        ctx.strokeStyle = "lightblue";
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

        // if hovering the start point, render an indicator
        const d = Math.hypot(room.points[0][0] - m[0], room.points[0][1] - m[1]);
        if (d < 10 && room.points.length > 2 && !room.done) {
            ctx.beginPath();
            ctx.arc(room.points[0][0], room.points[0][1], 10, 0, Math.PI * 2);
            ctx.strokeStyle = "rgb(0, 127, 255)";
            ctx.lineWidth = 5;
            ctx.stroke();
        }

        i++;

        // if the room is complete, calculate the centre of it, and draw a label
        if (room.points.length > 2) {
            // get the centre from the middle of the bounds
            const centre = [(room.min[0] + room.max[0]) / 2, (room.min[1] + room.max[1]) / 2];

            // render label
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.strokeText(room.name, ...centre);
            ctx.fillText(room.name, ...centre);
        }
    }

    ctx.restore();
}

// start the animation loop
requestAnimationFrame(update)

// when creating an new room, clear the name input
createRoomBtn.onclick = () => {
    if (!creatingRoom || rooms.length == 0) return;

    creatingRoom = false;

    roomNameInput.value = "";
}

// when cancelling a room, delete the room and update the room list 
cancelRoomBtn.onclick = () => {
    if (!creatingRoom || rooms.length == 0) return;

    rooms.splice(rooms.length - 1, 1);
    creatingRoom = false;
    roomNameInput.value = "";
    updateList();
}

// when the user inputs a new room name, update it and the list
roomNameInput.oninput = () => {
    if (!creatingRoom || rooms.length == 0) return;

    rooms[rooms.length - 1].name = roomNameInput.value;
    updateList();
}

// when the user inputs a new room name, update it and the list
roomNameEdit.oninput = () => {
    if (selectedRoom == null) return;

    rooms[selectedRoom].name = roomNameEdit.value;
    updateList()
}

// when the user deletes a room, remove it and update the list
roomDeleteBtn.onclick = () => {
    if (selectedRoom == null) return;

    rooms.splice(selectedRoom, 1);
    selectedRoom = null;
    updateList();
}

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
        camera.x -= e.movementX;
        camera.y -= e.movementY;
        tcamera.x -= e.movementX;
        tcamera.y -= e.movementY;
        moved.x -= e.movementX;
        moved.y -= e.movementY;
    }

})

// grab the position of the mouse
canvas.addEventListener("mouseup", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    mouse.down = false;

    const d = Math.hypot(moved.x, moved.y);
    moved.x = 0;
    moved.y = 0;

    if (d < 10) {
        if (!creatingRoom) {
            let interacted = false;
            let i = 0;
            const hadSelected = selectedRoom != null;
            selectedRoom = null;
            for (const room of rooms) {
                if (room.hovered) {
                    interacted = true;
                    selectedRoom = i;
                    roomCreateDIV.style.display = "none";
                    roomSelectDIV.style.display = "block";

                    roomNameEdit.value = room.name;
                }
                i++
            }

            if (interacted || hadSelected) return;

            roomCreateDIV.style.display = "block";
            roomSelectDIV.style.display = "none";

            creatingRoom = true;
            const point = canvasToMap(mouse.x, mouse.y);
            rooms.push({ name: "", min: [...point], max: [...point], points: [point], done: false, hover: 0, hovered: false });
            updateList();
        } else if (rooms.length > 0 && !rooms[rooms.length - 1].done) {
            const room = rooms[rooms.length - 1];

            const m = canvasToMap(mouse.x, mouse.y);
            const d = Math.hypot(room.points[0][0] - m[0], room.points[0][1] - m[1]);
            if (d < 10 && room.points.length > 2) {
                room.done = true;
            } else {
                room.points.push(m);
            }
        }
    }
})

// if zooming, zoom camera, otherwise, pan camera
canvas.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
        const f = Math.exp(-Math.min(Math.max(e.deltaY, -15), 15) * 0.015);

        tcamera.zoom *= f;
        tcamera.x = (tcamera.x + mouse.x) * f - mouse.x;
        tcamera.y = (tcamera.y + mouse.y) * f - mouse.y;

        // tcamera.x += (((mouse.x - w)))
    } else {
        tcamera.x += e.deltaX;
        tcamera.y += e.deltaY;
    }
    e.preventDefault();
}, { passive: false })

//

// when saving the map, use the insert api
saveBtn.onclick = async () => {
    await fetch("/insert.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // fill the request with the rooms data
        body: JSON.stringify({ request: currentMap != null ? 'map_update' : 'map', map_id: currentMap != null ? currentMap : undefined, map_name: mapNameInput.value, map_rooms: rooms.map(room => { return { name: room.name, points: JSON.stringify(room.points) } }) })  // Send a request to insert a new map
    })
        //convert the response to text
        .then(response => response.json())
        //show the response
        .then(data => {
            console.log(data)
            if (currentMap == null) currentMap = data.map_id;
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));

    updateMapList();
}

// when starting a new map, clera the rooms and map name
newBtn.onclick = async () => {
    rooms.length = 0;
    currentMap = null;
    mapNameInput.value = "New Map";
}

// when deleting a map, use the insert api to delete by map id, then clear variables
deleteBtn.onclick = async () => {
    if (currentMap == null) return;

    // use the api, and clear the map by id
    await fetch("/insert.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'map_delete', map_id: currentMap })
    })
        //convert the response to text
        .then(response => response.text())
        //show the response
        .then(data => {
            console.log(data)
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));

    // fetch the new map list
    updateMapList();

    // clear the loaded rooms and map name
    rooms.length = 0;
    currentMap = null;
    mapNameInput.value = "New Map";
}

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

    console.log(id, roomsData);
    if (!roomsData || roomsData.message == "No data found") return; // if there is no data or the map didn't exist, return

    // clear the rooms on the map
    rooms.length = 0;

    // for each room in in the data, add it to the map
    for (const room of roomsData) {
        rooms.push({ name: room.room_name, points: JSON.parse(room.points), min: [0, 0], max: [0, 0], done: true, hover: 0, hovered: false })
    }

    // update the room list
    updateList();
}

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