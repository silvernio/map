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
    //Slet itemslist=(JSON.stringify(items));
    fetch("/insert.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'addEquipment' ,items:items,ListName:listName})  // Send a request to get crash type data
    })

        .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

});

    const subjects=document.getElementById("subjects")  

    function getsubjects(){
        console.log("getsubjects");
        fetch("/api.php", {
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
                subjects.innerHTML += `<option value="${subject.subject_id}">Year   ${subject.subject_year} - ${subject.subject_name}</option>`
            }
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));
    } 
    getsubjects() 
    showequipment()

    function showequipment() { 
       
        fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'getequipment' })  // Send a request to get crash type data
    })
          .then(response => response.json())
        //then do something with the data
        
        .then(data => { 
        
        const groupeddata = {}; 
                
        data.forEach(item => { 
        if (!groupeddata[item.subject_name]) {
        (groupeddata)[item.subject_name] = [];
        } 
        groupeddata[item.subject_name].push(item.item_name);
        });
         

        let output =`<table border="1"><tr><th>Name</th><th>Equipment Lists</th></tr>`; 
                
        for (const subjectName in groupeddata) {
        const itemsList = groupeddata[subjectName].join(', ');  
        output += `<tr><td>${subjectName}</td><td>${itemsList}</td></tr>`;
     }
        console.log(data) 
        console.log("print table");
           
            for (const subject of data){
                console.log(subject);
                //output+= `<tr><td>${subject.subject_name}</td><td>${subject.item_name}</td></tr>`;
            }
            output+="</table>";
            console.log(output);
            document.getElementById("equipmenttable").innerHTML=output;
        })
        
        
    } 
    
        