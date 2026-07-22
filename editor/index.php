<?php require __DIR__ . "/../header-head.php" ?>

<link rel="stylesheet" href="style.css">

<?php require __DIR__ . "/../header-body.php" ?>

<div id="actions">
      <details>
        <summary>File</summary>

        <button id="newBtn">New</button>
        <button id="saveBtn">Save</button>

        <details>
            <summary>Load</summary>
            <div id="maps">
                <button>School</button>
                <button>Cool</button>
            </div>
        </details>

        <button id="deleteBtn">Delete</button>
    </details>

    <input type="text" value="New Map" id="mapName" list="mapList">
    
    <details>
        <summary>Background</summary>

        <form action="insert.php">
            <input type="file" name="Background" id="bg">
            <br>
            *work in progress
        </form>
        
    </details>
</div>

<div id="sidebar">
    <h1>Rooms</h1>
    <div id="rooms"></div>
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