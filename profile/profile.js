// Get references to profile HTML elements

const profileImg = document.getElementById('profileImg');

const profileName = document.getElementById('profileName');

const profileTitle = document.getElementById('profileTitle');

const profileInfo = document.getElementById('profileInfo');

const signInBtn = document.getElementById('signInBtn')

const profileWindow = document.getElementById('profileWindow');

const profileMessage = document.getElementById('profileMessage');

const logOutButton = document.getElementById('logOutButton')

// Set up window toggle
let isHidden = false;

// profileImg.onerror = () => {
//     profileImg.src = '/default_pfp.png';
// }

const bigButton = document.getElementById('bigButton')

bigButton.onclick = () => {
    // Window has smooth CSS animations to handle position changes
    isHidden = !isHidden
    if (isHidden) {
        profileWindow.style.right = '10px';
    }
    else {
        let w = Number(profileWindow.clientWidth);''

        // 10px offscreen

        profileWindow.style.right = (-10 - w) + 'px';
    }
}

logOutButton.onclick = () => {
    fetch("/account.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'logout' }) 
    })
        //convert the response to json
        .then(response => response.json())
        //then do something with the data
        .then(data => {
            console.log(data)
            if (data.message) {
                // Show response message for 5 seconds
                profileMessage.innerText = data.message;
                profileMessage.style.display = 'block';

                setTimeout(() => {profileMessage.style.display = 'none'; profileMessage.innerText = ''}, 5_000)
            }
            if (data.logout) {
                signInBtn.style.display = 'inline';

                profileName.style.color = 'red';

                profileName.innerText = 'Not Logged In'

                profileInfo.style.display = 'none';

                logOutButton.style.display = 'none';

                profileImg.src = '/default_pfp.png';
            }
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));
}

// This function runs after the user signs in with the Google popup window
function googleLogIn(response) {
    fetch("/account.php", {
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
            console.log(data)
            if (data.message) {
                // Show response message for 5 seconds
                profileMessage.innerText = data.message;
                profileMessage.style.display = 'block';

                setTimeout(() => {profileMessage.style.display = 'none'; profileMessage.innerText = ''}, 5_000)
            }
            if (data.account) {
                let account = data.account;

                // Display information to user

                let isTeacherString = (account.is_teacher == '1' ? 'Teacher' : 'Student')
                profileTitle.innerText = 'Account';

                signInBtn.style.display = 'none';

                profileName.innerText = account.first_name;

                profileName.style.color = 'black';

                profileInfo.innerText = `${account.first_name} ${account.last_name} (${isTeacherString})`

                profileInfo.style.display = 'block';

                logOutButton.style.display = 'flex';
            }
            if (data.picture) {
                // Use the account's profile picture given by Google
                profileImg.src = data.picture;
            }
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));
}

async function getAccount() {
    // Check the user's cookie to see if they are currently logged in
    let response = await fetch('/profile/profile_api.php');

    let account = await response.json();

    return account;
}

async function onLoad() {
    let account = await getAccount();

    // Picture is only returned for a successful account
    if (!account.picture) return;

    // Show information to user if logged in when loading page
    let isTeacherString = (account.is_teacher == '1' ? 'Teacher' : 'Student');
    profileTitle.innerText = 'Account';

    signInBtn.style.display = 'none';

    profileName.innerText = account.first_name;

    profileName.style.color = 'black';

    profileInfo.innerText = `${account.first_name} ${account.last_name} (${isTeacherString})`;

    profileInfo.style.display = 'block';
    profileImg.src = account.picture;

    logOutButton.style.display = 'flex';
}

// Run function on startup
onLoad();