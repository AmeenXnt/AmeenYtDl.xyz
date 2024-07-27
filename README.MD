# Music App

This application allows you to search for YouTube videos and download them as audio files.

## How to Run

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the server.
4. Open your browser and go to `http://localhost:3000` to use the application.

## Endpoints

- `GET /search?q=<query>`: Searches for YouTube videos.
- `GET /download?url=<videoUrl>`: Downloads the audio of the specified YouTube video.
