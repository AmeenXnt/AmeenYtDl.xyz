import express from 'express';
import ytdl from 'ytdl-core';
import yts from 'yt-search';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';

const app = express();
const streamPipeline = promisify(pipeline);

app.use(express.static('public'));

// Endpoint to search YouTube videos
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send('No search query provided');

    try {
        const search = await yts(query);
        const videos = search.videos.slice(0, 5).map(video => ({
            title: video.title,
            thumbnail: video.thumbnail,
            url: video.url,
            duration: video.timestamp,
            views: video.views,
            ago: video.ago,
        }));
        res.json(videos);
    } catch (error) {
        res.status(500).send('Error searching YouTube videos');
    }
});

// Endpoint to download and convert YouTube video to audio
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('No video URL provided');

    try {
        const audioStream = ytdl(videoUrl, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        const tmpDir = os.tmpdir();
        const fileName = `audio-${Date.now()}.mp3`;
        const filePath = `${tmpDir}/${fileName}`;
        const writableStream = fs.createWriteStream(filePath);

        await streamPipeline(audioStream, writableStream);

        res.download(filePath, fileName, () => {
            fs.unlink(filePath, err => {
                if (err) console.error('Failed to delete audio file:', err);
            });
        });
    } catch (error) {
        res.status(500).send('Error downloading and converting YouTube video');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
