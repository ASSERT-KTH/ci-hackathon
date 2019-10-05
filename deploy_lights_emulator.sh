
git push origin --delete lights
git add resources/emulators/lights/src/light_controller/ && git commit -m "New lights server version"
git subtree push  --prefix resources/emulators/lights/src/light_controller origin lights