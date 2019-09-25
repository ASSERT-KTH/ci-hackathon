# Organ Emulator

### :warning: This is work in progress. The following instructions and specifications may be subject to changes.

### Prerequisites

Docker is the preferred development environment for this project. If you have the Docker engine already installed and configured on your machine you can jump directly to the next section otherwise you can follow the steps below

1. Download Docker
   - for Mac from https://docs.docker.com/docker-for-mac/
   - for Windows from https://docs.docker.com/docker-for-windows/
2. Follow the instruction and install Docker

### Quick start

1. In the root of this emulator folder (`/resources/emulators/organ/`) run the command `docker-compose up` in order to start the server.
2. Wait that the Docker container is built then open the page at the URL [localhost:3000/](localhost:3000/) in the browser.
3. Test the emulator by opening the page at the URL [localhost:3000/notes/C3/1](localhost:3000/notes/C3/1) in the browser. A sound should be produced equivalent to the note _C3_ of length _1_. If no sound is emitted please try to refresh both open pages.

### Roadmap

- [ ] Add proper POST endpoint which allows to send a request with a payload containing note length and composition (chord)
- [ ] Add endpoint to change sound type in order to simulate organ stops (registration)
- [ ] Split endpoints in notes on keyboard and pedals
- [ ] Deploy emulator to web server
- [ ] Run web server on Raspberry PI
- [ ] Interface server on Raspberry PI with MIDI system
