# TrailMix Pro

Angular + Express + MongoDB.

This is an app for sharing mountaineering experiences.  

## Quick start (Windows)
1) Start MongoDB service (or run mongod manually).
2) API
   ```powershell
   cd server
   Copy-Item .env.sample .env
   npm i
   npm run dev   # http://localhost:4000
   ```
3) Angular
   ```powershell
   cd ..\client
   npm i
   npm start     # http://localhost:4200
   ```

Demo:
- admin@trailmix.dev / adminpass
- demo@trailmix.dev  / demopass

### Replace the starting images
Drop your files (keeping the same names) into `server/seed-images/`:
- vitosha.png
- rila-seven-lakes.png
- musala.png

Then delete same-named files from `server/uploads/` and restart the API, or just overwrite in `server/uploads/` and restart.
