<div class="flex flex-col fixed self-center md:self-auto items-center md:items-auto bottom-4 md:top-4 h-min" id="tooltips">
    <div id="tooltip-wrapper" class="flex md:top-20 md:left-5 md:w-max max-w-sm md:max-w-md xl:max-w-lg" style="display: none"></div>
    <div id="tooltip-icons" class="flex flex-row bottom  align-bottom text-white  symbol-fill gap-6 md:gap-2 md:justify-center md:justify-start">
        <?php if ($stats) { ?>
            <span class="material-symbols-rounded md:text-4xl tooltip-inactive" data-id="stats">
                bar_chart
            </span>
        <?php } ?>

        <?php if ($schedule) { ?>
        <span class="material-symbols-rounded md:text-4xl tooltip-inactive" data-id="schedule">
            schedule
        </span>
        <?php } ?>

        <?php if ($promo) { ?>
        <span class="material-symbols-rounded md:text-4xl tooltip-inactive" data-id="promo">
            diversity_1
        </span>
        <?php } ?>

        <?php if ($help) { ?>
        <span class="material-symbols-rounded md:text-4xl tooltip-inactive" data-id="help">
            help
        </span>
        <?php } ?>

        <?php if ($settings) { ?>
        <span class="material-symbols-rounded md:text-4xl tooltip-inactive"  data-id="settings">
            settings
        </span> 
        <?php } ?>

        <?php if ($logs) { ?>
        <span class="material-symbols-rounded md:text-4xl tooltip-inactive" data-id="logs">
            receipt_long
        </span>
        <?php } ?>

        <!-- <span class="material-symbols-rounded md:text-4xl"  data-id="accessibility">
            settings_accessibility
        </span> -->
    </div>
</div>