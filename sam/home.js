const notifTemplate = document.getElementById('notif-template')

const notifContainer = document.getElementById('notif-container')

function createNotifHTML(title, text, is_urgent) {
    is_urgent = parseInt(is_urgent);
    let notif = notifTemplate.cloneNode(true) // true to clone with all children cloned too
    notif.id = '';

    notif.querySelector('.title').innerText = title + (is_urgent ? ' (High Importance)' : '');
    notif.querySelector('.text').innerText = text;
    notif.querySelector('.is-urgent').style.display = is_urgent ? 'flex' : 'none';
    notif.style.display = 'flex';

    notifContainer.appendChild(notif);
}

createNotifHTML('Notification 1', 'This is a test.', '1')

createNotifHTML('Notification 2', 'This is another test. It is not as important.', '0')