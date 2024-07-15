<div class="flex flex-row justify-center items-center margin-0 mx-auto flex-wrap md:flex-nowrap flex-1">
    <div class="flex flex-col">

        <?php include 'include/template/title.php'; ?>

        <div class="flex flex-row justify-center">
            <div class="shadow-theme flex flex-col justify-center items-center p-4 m-4 mb-0 text-center bg-paper gap-1 md:gap-4 h-min md:w-min md:h-min aspect-square" id="cards-game">
                <div id="cards-win" class="flex flex-1 flex-col gap-2 justify-evenly hidden w-fit">
                </div>
                <div id="cards-module" class="h-max md:h-max md:w-max cards-module grid grid-cols-4 gap-1 md:gap-4 w-fit">
                </div>
                <div id="modal-wrapper" class="z-10 hidden">

                </div>
            </div>
            <div class="message flex absolute px-4 py-2 rounded-2xl hidden">
                JUST MONIKA
            </div>
        </div>

        <section class="buttons flex flex-col-reverse md:flex-row justify-center md:justify-evenly gap-4 mt-4">
            <div class="flex justify-evenly">
                <button type="button" data-id="shuffle" class="shadow-theme text-dark font-bold py-2 px-4 themed rounded-xl button--shuffle block md:hidden">
                    Shuffle
                </button>
                <button type="button" data-id="submit" class="shadow-theme text-dark font-bold py-2 px-4 rounded-xl button--submit button--disabled" disabled>
                    Submit
                </button>
            </div>
            <section class="health flex justify-center md:justify-between upheaval">
                <span class="flex ml-2 items-between hearts">
                </span>
            </section>
        </section>
    </div>

    <div class="shuffle-mobile flex-col gap-4 items-center md:flex">
        <button type="button" data-id="shuffle" class="shadow-theme themed text-white font-bold p-3 rounded-full">
            <span class="material-symbols-outlined align-bottom">
                shuffle
                </span>
        </button>
    </div>
</div>