<div class="flex flex-row justify-center items-center margin-0 mx-auto flex-wrap md:flex-nowrap flex-1">
    <div class="flex flex-col">

        <?php include 'include/template/title.php'; ?>

        <div class="flex mb-10 flex-col jutify-center p-4 rounded-3xl self-center md:w-2/5 shadow-theme" id="options">
            <div class="flex flex-col gap-4">
                <h1 class="text-2xl font-bold self-center">Random settings</h1>    
                <p class="self-center">Some configurations may make the game difficult or repetitive.</p>
                <div class="flex flex-row-reverse gap-4 justify-center items-center">
                    <div class="flex flex-col text-left flex-1">
                        <h1 class="text-xl font-bold">Number of groups</h1>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 flex-1">
                        <input type="range" id="range-group" class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer" min="2" max="8" step="1"/>
                        <ul class="flex justify-between w-full px-[10px]">
                            <li class="flex justify-center relative"><span class="absolute">2</span></li>
                            <li class="flex justify-center relative"><span class="absolute">3</span></li>
                            <li class="flex justify-center relative"><span class="absolute">4</span></li>
                            <li class="flex justify-center relative"><span class="absolute">5</span></li>
                            <li class="flex justify-center relative"><span class="absolute">6</span></li>
                            <li class="flex justify-center relative"><span class="absolute">7</span></li>
                            <li class="flex justify-center relative"><span class="absolute">8</span></li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-4 justify-center items-center">
                    <div class="flex flex-col text-left flex-1">
                        <h1 class="text-xl font-bold">Number of items per group</h1>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 flex-1">
                        <input type="range" id="range-items" class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer" min="2" max="8" step="1"/>
                        <ul class="flex justify-between w-full px-[10px]">
                            <li class="flex justify-center relative"><span class="absolute">2</span></li>
                            <li class="flex justify-center relative"><span class="absolute">3</span></li>
                            <li class="flex justify-center relative"><span class="absolute">4</span></li>
                            <li class="flex justify-center relative"><span class="absolute">5</span></li>
                            <li class="flex justify-center relative"><span class="absolute">6</span></li>
                            <li class="flex justify-center relative"><span class="absolute">7</span></li>
                            <li class="flex justify-center relative"><span class="absolute">8</span></li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-4 justify-center items-center">
                    <div class="flex flex-row text-left flex-1 items-end gap-4">
                        <h1 class="text-xl font-bold">Curse of the Blind items: </h1>
                        <p id="range-blind-current-value">0</p>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 flex-1">
                        <input type="range" id="range-blind" class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer" min="0" max="8" step="1"/>
                        <ul class="flex justify-between w-full px-[10px]">
                            <li class="flex justify-center relative"><span class="absolute">0</span></li>
                            <li class="flex justify-center relative"><span id="range-blind-max-value" class="absolute">8</span></li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-4 justify-end">
                    <div class="flex flex-col text-left">
                        <h1 class="text-xl">Reveal only submitted blind items</h1>
                        <p class="text-sm">If checked, only the submitted blind items are revealed. lorem</b></p>
                    </div>
                    <div class="checkbox-wrapper rounded-3xl h-fit">
                        <input class="tgl tgl-theme" id="only-submit-blind" type="checkbox"/>
                        <label class="tgl-btn" for="only-submit-blind">
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-4 justify-center items-center">
                    <div class="flex flex-col text-left flex-1">
                        <h1 class="text-xl font-bold">Health</h1>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 flex-1">
                        <input type="range" id="range-health" class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer" min="1" max="8" step="1"/>
                        <ul class="flex justify-between w-full px-[10px]">
                            <li class="flex justify-center relative"><span class="absolute">1</span></li>
                            <li class="flex justify-center relative"><span class="absolute">2</span></li>
                            <li class="flex justify-center relative"><span class="absolute">3</span></li>
                            <li class="flex justify-center relative"><span class="absolute">4</span></li>
                            <li class="flex justify-center relative"><span class="absolute">5</span></li>
                            <li class="flex justify-center relative"><span class="absolute">6</span></li>
                            <li class="flex justify-center relative"><span class="absolute">7</span></li>
                            <li class="flex justify-center relative"><span class="absolute">8</span></li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-4 justify-center items-center">
                    <div class="flex flex-col text-left flex-1">
                        <h1 class="text-xl font-bold">Difficulty</h1>                    
                        <p class="text-sm">Groups are assigned a difficulty from 0 to 3. Super easy means that Difficulty 3 groups won't appear and only 1 group can be Difficulty 2. Ultra hard means that Difficulty 0-1 groups are rerolled.</p>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 flex-1">
                        <input type="range" id="range-difficulty" class="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer" min="0" max="4" step="1"/>
                        <ul class="flex justify-between w-full px-[10px]">
                            <li class="flex justify-center relative"><span class="absolute">Super easy</span></li>
                            <li class="flex justify-center relative"><span class="absolute">Normal</span></li>
                            <li class="flex justify-center relative"><span class="absolute">Ultra hard</span></li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-4 items-center">
                    <div class="flex flex-col text-left">
                        <h1 class="text-xl">Prevent similar group themes</h1>
                        <p class="text-sm">Groups have tags depending on their theme. Enable this option to prevent grids from having multiple groups with the same theme. <b>Enable if you are unsure.</b></p>
                    </div>
                    <div class="checkbox-wrapper rounded-3xl h-fit">
                        <input class="tgl tgl-theme" id="tags" type="checkbox"/>
                        <label class="tgl-btn" for="tags">
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-4 items-center">
                    <div class="flex flex-col text-left">
                        <h1 class="text-xl">Check grid before generate</h1>
                        <p class="text-sm">Tests the grid for item conflicts, to prevent items from a category on the grid from also fitting in another. Might not be possible with certain configurations. <b>Enable if you are unsure.</b></p>
                    </div>
                    <div class="checkbox-wrapper rounded-3xl h-fit">
                        <input class="tgl tgl-theme" id="check-grid" type="checkbox"/>
                        <label class="tgl-btn" for="check-grid">
                    </div>
                </div>

                <!-- <div class="flex flex-row-reverse gap-4 items-center">
                    <div class="flex flex-col text-left">
                        <h1 class="text-xl">Permalink</h1>
                    </div>
                    <div class="w-full rounded-3xl h-fit">
                        <input class="w-full tgl tgl-theme" id="permalink" type="input"/>
                        <label class="tgl-btn" for="permalink">
                    </div>
                </div> -->

                <div class="flex flex-row-reverse gap-4 items-center justify-evenly">
                    <button class="w-1/4 tgl default py-1 rounded-3xl" id="reset" type="button">Reset to default</button>
                    <button class="w-1/4 tgl default py-1 rounded-3xl" id="convert" type="button">Convert</button>
                    <button class="w-1/4 tgl default py-1 rounded-3xl" id="play" type="button">Play !</button>
                </div>
            </div>
        </div>
        
    </div>
</div>
