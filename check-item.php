<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Guess 4 groups of 4 items in Isaac. Changes everyday !">
    <link rel="icon" href="/assets/isaaconnect.ico" type="image/x-icon">
    <title>Isaaconnect</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/themes.css">
    <style>
        /* Style de base pour le dropdown */
        .dropdown {
            position: relative;
            display: inline-block;
        }
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
        }
        .dropdown-content div {
            padding: 8px 16px;
            cursor: pointer;
        }
        .dropdown-content div:hover {
            background-color: #ddd;
        }
        .show {
            display: block;
        }
    </style>
</head>
<body class="theme main-theme">
    <div class="absolute infos px-2 py-4 z-50 hidden">

    </div>


    <div class="flex flex-col h-full">
        <div id="title" class="flex self-center">
            <h1 class="upheaval text-5xl md:text-6xl shadow-theme text-white flex">ISAA<span>CONNECT</span></h1>
        </div>
        <div class="flex flex-row justify-center items-center margin-0 mx-auto flex-wrap md:flex-nowrap flex-1">

            

            <div class="flex flex-col items-center gap-8">
                <div class="flex flex-col gap-8">
                    <div class="dropdown">
                    <input type="text" id="input-items" class="p-2 border border-gray-300 rounded-md text-black" placeholder="Filter items">
                        <div id="dropdown-items" class="dropdown-content"></div>
                    </div>
                
                    <button id="check-in" type="button" class="shadow-theme text-dark font-bold py-2 px-4 rounded-xl button--default button--disabled" disabled>Already in ?</button>
                    <p id="display-if-in" class=""></p>
            </div>

        </div>

        <?php 
            $stats = false;
            $schedule = true;
            $promo = true;
            $help = true;
            $settings = true;
            $logs = true;
            $gamemode = true;
            include 'include/template/tooltips.php'; ?>
    </div>

    <script type="module" src="/dist/CheckItem/Check.js"></script>
</body>
</html>