
<?php require __DIR__ ."/../header.php" ?> 

 <h1>Equipment form</h1>

<select id="subject">
    <div id="subjects"></div>
</select>
<form id="equipmentList">
 

    <div id="items"> 

        <input type="text" placeholder="Enter item">
        <br>
    </div> 
    

    <button type="button" id="addItemBut">Add Item</button>
    <button type="submit">Submit</button>

</form>


<h1>Equipment Lists</h1>
<div id="equipmenttable"></div>

<script src="addequipment.js"></script>
