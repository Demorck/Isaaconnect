<?php
// include/helpers/helper.php

function getAssetPath($name) {
    $manifestPath = __DIR__ . '/../dist/manifest.json';
    if (file_exists($manifestPath)) {
        $manifest = json_decode(file_get_contents($manifestPath), true);
        return ($manifest[$name] ?? $name);   
    }

    echo 'No manifest file found';
    echo $manifestPath;
    return '/dist/' . $name;
}