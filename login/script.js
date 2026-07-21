const pfpImg = document.getElementById('pfpImage');

pfpImg.onerror = () => {
    pfpImg.src = 'default_pfp.png';
}

// This function triggers automatically after a successful sign-in
function googleLogIn(response) {
    console.log('google response', response);

    console.log('token?', typeof response.credential)

    fetch("../account.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ provider: 'google', token: response.credential }) 
    })
        //convert the response to json
        .then(response => response.json())
        //then do something with the data
        .then(data => {
            if (data.picture) {
                pfpImg.src = data.picture;
            }
            console.log(data)
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));
}