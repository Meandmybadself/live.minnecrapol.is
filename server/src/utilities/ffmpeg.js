const { spawn } = require('node:child_process');

class AudioService {
    _ffmpegProcess;
    _streamUrl;

    constructor(streamUrl) {
        this._streamUrl = streamUrl;
    }

    isPlaying() {
        return this._ffmpegProcess !== undefined;
    }

    start() {
        this._ffmpegProcess = spawn('ffmpeg', [
            '-f', 'alsa',
            '-c:a', 'pcm_s32le',
            '-channels', '2',
            '-sample_rate', '48000',
            '-i', 'hw:0,1',
            '-f', 'lavfi',
            '-i', 'color=c=blue:s=640x480:r=15',
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-f', 'flv',
            this._streamUrl
        ]);

        this._ffmpegProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        this._ffmpegProcess.stderr.on('data', (data) => {
            // console.error(`stderr: ${data}`);
        });
        this._ffmpegProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        process.on('exit', function () {
            if (this._ffmpegProcess) {
                this_ffmpegProcess.kill()
            }
        })
    }

    stop() {
        this._ffmpegProcess.kill();
    }
}

module.exports = AudioService;