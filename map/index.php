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

<!-- HENRY STUFF STARTS HERE -->
<title>Timetable</title>

<style id="style"></style>
<div class="tableWrapper" style="border: 1px solid black;">
    <table id="timetable">
        <tr>
            <th colspan = 2>
                Timetable
            </th>
        </tr>
    </table>
</div>


<script src="../henry/js/timetable_data.js"></script>
<script src="../henry/js/timetable.js"></script>

<link rel="stylesheet" href="../henry/css/styles.css">

<!-- HENRY STUFF ENDS HERE -->

<canvas id="canvas"></canvas>

<script type="module" src="script.js"></script>

</body>
</html>