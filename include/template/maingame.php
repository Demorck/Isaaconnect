<div class="flex flex-row justify-center items-center margin-0 mx-auto flex-wrap md:flex-nowrap flex-1">
    <div class="flex flex-col">

        <?php include 'include/template/title.php'; ?>

        <div class="flex flex-row justify-center">
            <div class="shadow-theme flex flex-col justify-start items-center p-4 m-4 mb-0 text-center bg-paper gap-1 h-min aspect-square" id="cards-game">
                <div id="cards-win" class="flex flex-col gap-2 justify-evenly hidden w-full">
                </div>
                <div id="cards-module" class="h-max md:h-max w-full h-full cards-module grid grid-cols-4 gap-1 md:flex md:flex-wrap flex-1 items-center justify-between w-fit">
                </div>
                <div id="modal-wrapper" class="z-10 hidden">
                </div>
            </div>
            <div class="message flex fixed top-1/2 px-4 py-2 rounded-2xl hidden">
                JUST MONIKA
            </div>
        </div>
        <!--  -->
        <section class="flex flex-col-reverse md:flex-row justify-center md:justify-evenly gap-4 mt-4">
            <div class="justify-center flex flex-1 items-center md:hidden timer">
                <p class="text-white gap-4 flex  ">Timer: <span data-id="timer"></span></p>
            </div>
            <div class="buttons items-center gap-4 flex md:flex-row flex-col-reverse justify-evenly" id="buttons-ingame">
                <button type="button" data-id="shuffle" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl button--shuffle block md:hidden">
                    Shuffle
                </button>
                <button type="button" data-id="deselect" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl button--shuffle">
                    Deselect
                </button>
                <button type="button" data-id="submit" class="shadow-theme text-dark font-bold py-2 px-4 rounded-xl button--submit button--disabled" disabled>
                    Submit
                </button>
            </div>
            <div class="buttons gap-4 flex justify-evenly hidden" id="buttons-finished">
                <button type="button" data-id="results" class="shadow-theme text-dark font-bold py-2 px-4 rounded-xl button--submit">
                    View Results
                </button>
                <button type="button" data-id="play-again" class="shadow-theme text-dark font-bold py-2 px-4 rounded-xl button--submit hidden">
                    Play Again
                </button>
                <button type="button" data-id="change-settings" class="shadow-theme text-dark font-bold py-2 px-4 rounded-xl button--submit hidden">
                    Change Settings
                </button>
            </div>
            <section class="health flex justify-center md:justify-between upheaval">
                <span class="flex flex-col items-start ml-2 items-between hearts">
                </span>
            </section>
        </section>
    </div>

    <div class="shuffle-mobile flex-col gap-4 items-start md:flex">
        <button type="button" data-id="shuffle" class="shadow-theme themed text-white font-bold p-3 rounded-full">
            <span class="material-symbols-outlined align-bottom">
                shuffle
            </span>
        </button>
        <div class="text-white w-1">
            Timer: <br>
            <span data-id="timer">

            </span>
        </div>
    </div>
</div>