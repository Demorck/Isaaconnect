<div class="flex flex-col justify-center items-center margin-0 mx-auto w-3/4 flex-wrap md:flex-nowrap flex-1" data-custom="false">

    <?php include 'title.php'; ?>

    <div class="flex flex-col w-full">

        <div class="flex mb-10 flex-col jutify-center p-4 rounded-3xl self-center shadow-theme" id="options">
            <div class="flex flex-col gap-4">
                <h1 class="text-2xl font-bold self-center">Import a custom game</h1>
                <p class="self-center">Past your custom game link below and click "Play !"</p>
                <ul class="errors">
                </ul>
                <textarea id="textarea" col="100" row="100" class="w-full bg-white rounded-lg h-[20vh] cursor-pointer"></textarea>
                <div class="flex flex-row-reverse gap-4 items-center justify-evenly">
                    <button class="w-1/4 tgl default py-1 rounded-3xl" id="play" type="button">Play !</button>
                </div>
            </div>
        </div>

    </div>
</div>
