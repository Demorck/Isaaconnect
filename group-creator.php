<?php
    include 'include/template/header.php';
    include 'include/Helper.php';
?>
<body class="theme main-theme">
    <div class="absolute infos px-2 py-4 z-50 hidden">

    </div>
    <div class="menu menu-left z-30" id="menu-left">
        <pre class="flex flex-col bg-white p-4 m-4 mb-0 rounded-3xl text-black overflow-y-auto hidden" id="code">

        </pre>
    </div>
    <button class="menu-button menu-button-left z-50" id="open-menu-left">Show code</button>


    <div class="flex flex-col h-full">
        <div id="title" class="flex self-center">
            <h1 class="upheaval text-5xl md:text-6xl shadow-theme text-white flex">ISAA<span>CONNECT</span></h1>
        </div>
        <div class="flex flex-row justify-center items-center margin-0 mx-auto flex-wrap md:flex-nowrap flex-1">

            

            <div class="flex flex-col">
                <div class="flex flex-col gap-4 justify-center">
                    <input type="text" id="filter-input" class="p-2 border border-gray-300 rounded-md" placeholder="Filter groups">
                    <div style="height: 600px;" class="flex flex-row">
                        <div class="flex flex-col gap-2">
                            <div  class="shadow-theme h-full p-4 m-4 mb-0 text-center rounded-3xl bg-white overflow-y-auto flex flex-col" id="groups-wrapper">
                        
                            </div>
                            <div class="flex flex-row justify-evenly">
                                <button type="button" id="add-group" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl">
                                    Ajouter
                                </button>
                                <button type="button" id="delete-group" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div  class="shadow-theme h-full overflow-y-auto w-96 flex flex-row flex-wrap justify-center items-center p-4 m-4 mb-0 rounded-3xl bg-white" id="items-wrapper">
                                
                            </div>
                            <div class="flex flex-row justify-evenly">
                                <button type="button" id="add-item" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl">
                                    Ajouter
                                </button>
                                <button type="button" id="delete-item" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="button" id="generate" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl">
                        Generate
                    </button>

                </div>
            </div>

        </div>
    </div>

    <div class="menu menu-right z-30 py-4" id="menu-right">
        <input type="text" id="filter-items-input" class="p-2 border border-gray-300 rounded-md text-black" placeholder="Filter items">
        <label for="toggle-regex"><input type="checkbox" id="toggle-regex"> Regex ?</label>
        <div class="flex flex-wrap" id="items">

        </div>
    </div>
    <button class="menu-button menu-button-right z-50" id="open-menu-right">Items</button>

    <div class="flex flex-col relative md:fixed hidden">
        <div id="tooltip-wrapper" class="bottom-20 md:top-20 max-w-sm md:max-w-md xl:max-w-lg" style="display: none"></div>
        <div id="tooltip-icons" class="flex flex-row bottom align-bottom text-white  symbol-fill gap-6 md:gap-2 justify-center md:justify-start">
            <span class="material-symbols-rounded md:text-4xl" data-id="stats">
                bar_chart
            </span>
            <span class="material-symbols-rounded md:text-4xl" data-id="schedule">
                schedule
            </span>
            <span class="material-symbols-rounded md:text-4xl" data-id="promo">
                diversity_1
            </span>
            <span class="material-symbols-rounded md:text-4xl" data-id="help">
                help
            </span>
            <span class="material-symbols-rounded md:text-4xl"  data-id="settings">
                settings
            </span>
            <!-- <span class="material-symbols-rounded md:text-4xl"  data-id="accessibility">
                settings_accessibility
            </span> -->
        </div>
    </div>
    <script type="module" src="<?= getAssetPath("groupCreator.js"); ?>"></script>
    <script>
        document.getElementById('open-menu-right').addEventListener('click', function() {
            var menu = document.getElementById('menu-right');
            if (menu.style.right === '0px') {
                menu.style.right = '-400px';
            } else {
                menu.style.right = '0px';
            }
        });

        document.getElementById('open-menu-left').addEventListener('click', function() {
            var menu = document.getElementById('menu-left');
            if (menu.style.left === '0px') {
                menu.style.left = '-800px';
            } else {
                menu.style.left = '0px';
            }
        });

        
    </script>
</body>
</html>