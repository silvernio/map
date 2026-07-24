<title>Add To Timetable</title>

<?php include '../../header.php' ?>

<table style="width:80%">
        <tr>
            <th>Field Name</th>
            <th>Input</th>
        </tr>

        <tr> 
            <th><br></th> 
        </tr>

        <!-- <tr>
            <th>Student Name</th>
            <th>
                <input list="studentDatalist" id="students">
                <datalist id="studentDatalist"></datalist>
            </th>
        </tr> -->
        
        <tr>
            <th>Teacher Name</th>
            <th>
                <input list="teacherDatalist" id="teachers">
                <datalist id="teacherDatalist"></datalist>
            </th>
        </tr>

        <tr> 
            <th><br></th> 
        </tr>

        <tr>
            <th>Subject</th>
            <th>
                <input list="subjectDatalist" id="subjects">
                <datalist id="subjectDatalist"></datalist>
            </th>
        </tr>

        <tr>
            <th>Module</th>
            <th>
                <select id="module">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                </select>
            </th>
        </tr>

        <tr>
            <th>Day</th>
            <th>
            <select id="day">
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                </select>
            </th>
        </tr>

        <tr> 
            <th><br></th> 
        </tr>

        <tr>
            <th>
                <button class="button" onclick="addToDB()">Add to Database</button>
            </th>
        </tr>
</table>

<script src="js/script.js"></script>
<link rel="stylesheet" href="css/style.css">