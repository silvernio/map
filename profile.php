<button id="bigButton" style="background-color: rgba(0,0,0,0); position: absolute; height: 50px; top: 0px; right: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 15px; cursor:pointer; border: 0;">

<label id="profileName" style="font-size:large; cursor:pointer; color:crimson;">Not Logged In</label>

<img src="/default_pfp.png" alt="Profile picture" id="profileImg" referrerpolicy="no-referrer" style="aspect-ratio: 1; width: 30px; border-radius: 50%; cursor:pointer;">

</button>

<script src="https://accounts.google.com/gsi/client" async defer></script>

<div id="profileWindow" style="position: absolute; right: -500px; top: 60px; border: 2px solid black; border-radius: 5px; padding: 10px; aspect-ratio: 0.6; transition: all 1s; background-color:white; z-index: 100;">
    <h2 id="profileTitle">Log In / Sign Up</h2>

    <p id="profileMessage" style="display: none; border-radius: 5px; background-color:antiquewhite; padding: 5px; border: 2px solid bisque;">Successfully logged in!</p>

    <p id="profileInfo" style="display: none;">John Smith</p>

    <div id="g_id_onload"
         data-client_id="339013531173-ifepgkm2cbseplot0e7ds804p0kceces.apps.googleusercontent.com"
         data-callback="googleLogIn"
         data-auto_prompt="false">
    </div>

    <div class="g_id_signin"
         data-type="standard"
         data-size="large"
         data-theme="outline"
         data-text="sign_in_with"
         data-shape="rectangular"
         data-logo_alignment="left"
        id="signInBtn"
    >
    </div>
</div>

<script src="/profile.js"></script>
