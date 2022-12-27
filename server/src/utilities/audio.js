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
            '-i', 'hw:0,0',
            '-acodec', 'aac',
            '-ac', '1',
            '-f', 'flv',
            this._streamUrl
        ]);
        this._ffmpegProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        this._ffmpegProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        this._ffmpegProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        process.on('exit', function () { this_ffmpegProcess.kill() })
    }

    stop() {
        this._ffmpegProcess.kill();
    }
}

module.exports = AudioService;