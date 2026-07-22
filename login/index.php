<?php include '../header.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login with Google</title>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
    <h1>Log In</h1>

    <div id="g_id_onload"
         data-client_id="339013531173-ifepgkm2cbseplot0e7ds804p0kceces.apps.googleusercontent.com"
         data-callback="googleLogIn"
         data-auto_prompt="false">
    </div>

    <input type="checkbox" name="admin" id="isAdminCheckbox">
    <br>
    <img id="pfpImage" src="../default_pfp.png" alt="User profile picture" style="aspect-ratio: 1; border-radius: 50%; width: 50px;">

    <div class="g_id_signin"
         data-type="standard"
         data-size="large"
         data-theme="outline"
         data-text="sign_in_with"
         data-shape="rectangular"
         data-logo_alignment="left">
    </div>

    <script src="./script.js"></script>
</body>
</html>