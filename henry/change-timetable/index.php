<title>Add To Timetable</title>

<table style="width:80%">
        <tr>
            <th>Field Name</th>
            <th>Input</th>
        </tr>



        
        <tr>
            <th>Start Time</th>
            <th>
                <select id="sTime">
                    <option value="08:40">8:40</option>
                    <option value="09:20">9:20</option>
                    <option value="10:00">10:00</option>
                    <option value="10:20">10:20</option>
                    <option value="11:00">11:00</option>
                    <option value="11:40">11:40</option>
                    <option value="12:00">12:00</option>
                    <option value="12:40">12:40</option>
                    <option value="13:20">1:20</option>
                    <option value="14:00">2:00</option>
                    <option value="14:40">2:20</option>
                    <option value="15:20">3:20</option>
                </select>
            </th>
        </tr>

        <tr>
            <th>End Time</th>
            <th>
                <select id="eTime">
                    <option value="08:40">8:40</option>
                    <option value="09:20">9:20</option>
                    <option value="10:00">10:00</option>
                    <option value="10:20">10:20</option>
                    <option value="11:00">11:00</option>
                    <option value="11:40">11:40</option>
                    <option value="12:00">12:00</option>
                    <option value="12:40">12:40</option>
                    <option value="13:20">1:20</option>
                    <option value="14:00">2:00</option>
                    <option value="14:40">2:20</option>
                    <option value="15:20">3:20</option>
                </select>
            </th>
        </tr>

        <tr> 
            <th><br></th> 
        </tr>

        <tr>
            <th>Teacher Name</th>
            <input id="teacher" type="string"></input>
        </tr>
    </table>

    <button class="button" onclick="addToDB()">Add to Database</button>

    <script src="js/script.js"></script>
    <link rel="stylesheet" href="css/style.css">