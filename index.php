<?php define('ROOT', dirname(__DIR__) . "/map"); ?>

<?php require __DIR__ . '/header.php' ?>

    <p>Welcome to MapNav, a software designed for creation and management of maps and timetables.</p>

    <img id="main-img" src="/htmlads.png" alt="">

    <div id="notif-container">
        <div id="notif-template" class = 'notif'>
            <label class="is-urgent">!</label>
            <label class="title">Example Notification</label>
            <label class="text">Attention students! You should read this notification.</label>
        </div>
    </div>

    <script src="/sam/home.js"></script>
</body>
</html>