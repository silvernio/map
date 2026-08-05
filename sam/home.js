const notifTemplate = document.getElementById('notif-template')

const notifContainer = document.getElementById('notif-container')

function createNotifHTML(title, text, is_urgent, colour) {
    is_urgent = parseInt(is_urgent);
    let notif = notifTemplate.cloneNode(true) // true to clone with all children cloned too
    notif.id = '';

    let titleEl = notif.querySelector('.title');
    let textEl = notif.querySelector('.text');

    titleEl.innerText = title + (is_urgent ? ' (High Importance)' : '');
    textEl.innerText = text;
    notif.querySelector('.is-urgent').style.display = is_urgent ? 'flex' : 'none';
    notif.style.display = 'flex';
    notif.style.backgroundColor = colour;
    notifContainer.appendChild(notif);
    let rgb = getComputedStyle(notif).backgroundColor;
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    
    let [thing, r, g, b] = match;

    if (0.2126 * r + 0.7152 * g + 0.0722 * b >= 100) {
        titleEl.style.color = textEl.style.color = 'black';
    }
    else {
        titleEl.style.color = textEl.style.color = 'white';
    }

    notif.style.border = `2px solid rgb(${r * 0.5}, ${g * 0.5}, ${b * 0.5})`;
}

fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'notifications' }) 
    })
        //convert the response to json
        .then(response => response.json())
        //then do something with the data
        .then(data => {
            console.log(data);
            if (data.length && data.length > 0) {
                for (let notif of data) {
                    const {topic, text, is_urgent, colour} = notif;

                    createNotifHTML(topic, text, is_urgent, colour);
                }
            }
        })
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));