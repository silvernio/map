</head>
<body>
    <!-- nav -->
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item">
      

    </a>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">

    <img id="icon-img" src="/icon.png" alt="Icon">
    <h1>MapNav</h1>

    <div class="navbar-start">
      
      <a href="/" class="navbar-item">
        Home
      </a>

      <a href="/map/" class="navbar-item">
        Map
      </a>

      <a href="/henry/" class="navbar-item">
        Timetable
      </a>

      <a href="/editor/" class="navbar-item">
        Editor
      </a>
      <!-- <a href="/sam/" class="navbar-item">
        Sam
      </a> -->
      <!-- <a href="/rivergem/" class="navbar-item">
        Andrew
      </a> -->
    </div>

    <div class="navbar-end">
      <?php require __DIR__ . '/profile.php'?>
    </div>
  </div>
</nav>

<div id="nav-offset"></div>