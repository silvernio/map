const styleHTML = document.getElementById("style");

var width = window.innerWidth
var height = window.innerHeight

const styles = `
.tableWrapper {
    height:`+String(height-20)+`px;
    width:`+String((width-20)/3)+`px;

    margin-left: auto;
    margin-right: 0;

    overflow-y: auto;
    overflow-x: auto;
}
tr, td {
    border: 1px solid black;
}
table {
    height:`+String(height-20)+`px;
    width:`+String((width-20)/3)+`px;
    
    border-collapse: collapse;
    white-space:nowrap;

    margin-left: auto; 
    margin-right: 0;
}
th {
    position: sticky;
    top: 0;
    background-color: grey;

    box-shadow:
        inset 0 1px 0 black,
        inset 0 -1px 0 black,
        inset 1px 0 0 black,
        inset -1px 0 0 black;
}
`
styleHTML.innerHTML = styles