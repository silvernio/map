fetch("api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'students' })  // Send a request to get crash type data
    })
        //convert the response to json
        .then(response => response.json())
        //then do something with the data
        .then(data => {
            console.log(data)
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));