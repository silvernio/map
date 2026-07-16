<?php require __DIR__ . "/../header-head.php" ?>

<link rel="stylesheet" href="style.css">

<?php require __DIR__ . "/../header-body.php" ?>

<div id="sidebar">
    <h1>Map</h1>

    <div>
        <span>Map ID</span>
        <input id="mapName" type="text" value="4">
    </div>
    
    <button id="mapLoad">Load</button>
</div>

<canvas id="canvas"></canvas>

<script type="module" src="script.js"></script>

</body>
</html>