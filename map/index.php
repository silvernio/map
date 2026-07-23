<?php require __DIR__ . "/../header-head.php" ?>

<link rel="stylesheet" href="style.css">

<?php require __DIR__ . "/../header-body.php" ?>

<div id="sidebar">
    <div class="element">
        <span>Map</span>
        <select name="map" id="mapSelect"></select>
    </div>
    
    <style id="style"></style>
    <div class="tableWrapper" style="border: 1px solid black;">
        <table id="timetable">
            <tr>
                <th colspan=2>
                    Timetable
                </th>
            </tr>
        </table>
    </div>
</div>

<!-- HENRY STUFF STARTS HERE -->
    

<!-- <script src="../henry/js/timetable_data.js"></script>
<script src="../henry/js/timetable.js"></script>

<link rel="stylesheet" href="../henry/css/styles.css"> -->

<!-- HENRY STUFF ENDS HERE -->

<canvas id="canvas"></canvas>

<script type="module" src="script.js"></script>

</body>

</html>