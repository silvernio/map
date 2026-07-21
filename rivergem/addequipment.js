const addItemBut = document.getElementById("addItemBut");
const items = document.getElementById("items");
const name = document.getElementById("name");
const equipmentList = document.getElementById("equipmentList");

addItemBut.addEventListener("click", () => {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Enter item");
    items.appendChild(input);
    //line break
    const br = document.createElement("br");
    items.appendChild(br);
});

equipmentList.addEventListener("submit", (event) => {
    event.preventDefault();
const listName = document.getElementById("subject").value
console.log(listName)
    const items = Array.from(document.querySelectorAll("#items input"))
        .map(input => input.value);

    console.log(items);
    console.log(JSON.stringify(items));
    fetch("api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'addEquipment' ,items:items,listName:listName})  // Send a request to get crash type data
    })

        .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

});

    const subjects=document.getElementById("subjects")  

    function getsubjects (){
        fetch("api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'subjects' })  // Send a request to get crash type data
    })
        //convert the response to json
        .then(response => response.json())
        //then do something with the data
        .then(data => {
            console.log(data) 
            for (const subject of data){
                subjects.innerHTML += `<option value="${subject.subject_id}">${subject.subject_name}</option>`
            }
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));
    } 
    getsubjects()
