const profileImg = document.getElementById('profileImg');

const profileName = document.getElementById('profileName');

const profileTitle = document.getElementById('profileTitle');

const profileInfo = document.getElementById('profileInfo');

const signInBtn = document.getElementById('signInBtn')

const profileWindow = document.getElementById('profileWindow');

const profileMessage = document.getElementById('profileMessage');

document.body.style.overflowX = 'hidden';

let isHidden = false;

// profileImg.onerror = () => {
//     profileImg.src = '/default_pfp.png';
// }

const bigButton = document.getElementById('bigButton')

bigButton.onclick = () => {
    isHidden = !isHidden
    if (isHidden) {
        profileWindow.style.right = '10px';
    }
    else {
        let w = Number(profileWindow.clientWidth);

        profileWindow.style.right = (-10 - w) + 'px';
    }
}

function googleLogIn(response) {
    console.log('google response', response);

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
                profileMessage.innerText = data.message;
                profileMessage.style.display = 'block';

                setTimeout(() => {profileMessage.style.display = 'none'; profileMessage.innerText = ''}, 5_000)
            }
            if (data.account) {
                let account = data.account;

                let isTeacherString = (account.is_teacher == '1' ? 'Teacher' : 'Student')
                profileTitle.innerText = 'Account'

                signInBtn.style.display = 'none';

                profileName.innerText = account.first_name;

                profileInfo.innerText = `${account.first_name} ${account.last_name} (${isTeacherString})`

                profileInfo.style.display = 'block';
            }
            if (data.picture) {
                console.log(data.picture)
                profileImg.src = data.picture;

                console.log(profileImg)
            }
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));
}