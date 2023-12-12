# geo_camera

Demo Site: https://geocamera2023.web.app/

This is a simple app which implementing:

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)/[Dexie.js](https://dexie.org/): User-End Database, can be used offline, and store any type of data, even binary data
- [GeoLocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API): Get user's current location
- [ImageCapture API](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture): Take photo with device camera
- [Media Capture and Streams API](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Capture_and_Streams_API): Stream video from device camera, and capture a frame from the stream

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
