import { Loader } from '../Loader.js';
import { StorageManager } from '../Shared/Helpers/Data/StorageManager.js';
import { Utils } from '../Shared/Helpers/Utils.js';

let bool = false;
let erreur = 0;

let erreurstemps = [1, 2, 4, 7, 11, 16];
let temps = erreurstemps[erreur];
let audios: HTMLAudioElement[] = [];

document.addEventListener('DOMContentLoaded', async () => {

    let a = document.getElementById('a');
    let b = document.getElementById('audio') as HTMLAudioElement;
    let slider = document.getElementById('slider') as HTMLInputElement;

    for (let i = 0; i < erreurstemps.length; i++) {        
        let button = document.getElementById('b' + i) as HTMLButtonElement;
        button.addEventListener('click', () => {
            temps = erreurstemps[i];
            console.log(temps);
            
        });
    }

    if (b && b.src) {
        try {
            b = await trimAudio(b, 16);
            document.body.appendChild(b);
        } catch (error) {
            console.error('Error trimming audio:', error);
            return;
        }
    } else {
        console.error('Audio element has no source or is not found.');
        return;
    }
    
    await Loader.load();

    a?.addEventListener('click', async () => {
        if (bool) {
            b.pause();
            bool = false;
        } else {
            b.currentTime = 0;
            try {
                await b.play();
                bool = true;
                console.log(temps);
                
                while (b.currentTime < temps && !b.paused) {
                    await Utils.sleep(1);
                    let c = document.getElementById('rempli') as HTMLDivElement;
                    c.style.width = (b.currentTime / b.duration * 100) + "%";
                    
                }
                b.pause();
                bool = false;
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        }

        console.log("---");
        console.log(bool);
        console.log(b.currentTime);
        console.log(erreur);
        console.log(erreurstemps[erreur]);
        console.log(temps);
        console.log(b.duration);
        console.log("---");
    });

    slider?.addEventListener('input', () => {
        let volume = parseFloat(slider.value) / 1000;
        console.log(volume);
        b.volume = volume;
    });
});

async function trimAudio(audioElement: HTMLAudioElement, duration: number): Promise<HTMLAudioElement> {
    const audioContext = new (window.AudioContext)();
    
    const audioBuffer = await fetch(audioElement.src)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));

    const sampleRate = audioContext.sampleRate;
    const trimmedLength = Math.min(sampleRate * duration, audioBuffer.length); // Limite la durée à la longueur de l'audio

    const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels, 
        trimmedLength, 
        sampleRate
    );

    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    
    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);

    const renderedBuffer = await offlineContext.startRendering();

    const trimmedAudioElement = new Audio();
    const audioBlob = await bufferToWaveBlob(renderedBuffer);
    trimmedAudioElement.src = URL.createObjectURL(audioBlob);

    return trimmedAudioElement;
}

async function bufferToWaveBlob(buffer: AudioBuffer): Promise<Blob> {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2 + 44; // Taille du fichier WAV
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    
    // Fonction pour écrire les informations dans le fichier WAV
    function writeString(view: DataView, offset: number, string: string): void {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    let offset = 0;

    // RIFF chunk descriptor
    writeString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + buffer.length * numOfChannels * 2, true); offset += 4;
    writeString(view, offset, 'WAVE'); offset += 4;

    // FMT sub-chunk
    writeString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4; // Subchunk size (16 for PCM)
    view.setUint16(offset, 1, true); offset += 2;  // Audio format (1 for PCM)
    view.setUint16(offset, numOfChannels, true); offset += 2;  // Number of channels
    view.setUint32(offset, buffer.sampleRate, true); offset += 4;  // Sample rate
    view.setUint32(offset, buffer.sampleRate * numOfChannels * 2, true); offset += 4;  // Byte rate
    view.setUint16(offset, numOfChannels * 2, true); offset += 2;  // Block align
    view.setUint16(offset, 16, true); offset += 2;  // Bits per sample (16)

    // Data sub-chunk
    writeString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, buffer.length * numOfChannels * 2, true); offset += 4;

    // Write interleaved audio data
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numOfChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i])); // Clamp value between -1 and 1
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
}
