<?php require __DIR__ . "/../header-head.php" ?>

<link rel="stylesheet" href="style.css">

<?php require __DIR__ . "/../header-body.php" ?>

<div id="sidebar">
    <h1>Editor</h1>
</div>

<canvas id="canvas"></canvas>

<div id="roomManage">
    <div id="roomCreate" class="roomManageDiv">
        <input id="roomNameInput" type="text" placeholder="Name">
        <button id="createRoomBtn">Create</button>
        <button id="cancelRoomBtn">Cancel</button>
    </div>
    <div id="roomSelect" class="roomManageDiv">
         <input id="roomNameEdit" type="text" placeholder="Name">
        <button id="deleteRoomBtn">Delete</button>
    </div>
</div>

<script type="module" src="script.js"></script>

</body>
</html>