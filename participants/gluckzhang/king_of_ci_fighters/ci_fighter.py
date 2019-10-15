#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: ci_figher.py

import requests, time, json, threading, sys, signal
import subprocess
import websocket
import Queue
import pyautogui
import logging

KEEP_RUNNING = True
WINDOW_NAME = "Default - Wine desktop"
WINDOW_ID = -1
QUEUE_TRAVIS = Queue.Queue()

def websocket_listener():
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://travis.durieux.me/", on_message = on_message)
    ws.run_forever()

def on_message(ws, message):
    json_message = json.loads(message)
    build = dict()
    # logging.info(json_message["event"])
    if json_message["event"] == "job_finished":
        build["id"] = json_message["data"]["id"]
        build["state"] = json_message["data"]["state"]
        QUEUE_TRAVIS.put(build)

def build_id_consumer():
    while KEEP_RUNNING:
        if QUEUE_TRAVIS.qsize() > 5:
            passed_count = 0
            for i in range(0, 5):
                build = QUEUE_TRAVIS.get()
                logging.info(build)
                if build["state"] == "passed": passed_count = passed_count + 1

            if passed_count == 0:
                logging.info("passed_count: %d, total failure!"%passed_count)
                action("Left Left Left", 100, 0.2)
                action("Down+Right Down+Left+KP_1", 40, 3)
            elif passed_count == 1:
                logging.info("passed_count: %d, big failure!"%passed_count)
                action("Left Left Left", 100, 0.2)
                action("KP_4", 50, 0)
            elif passed_count == 2:
                logging.info("passed_count: %d, small failure!"%passed_count)
                action("Left Left Left", 100, 0.2)
                action("KP_1", 50, 0)
            elif passed_count == 3:
                logging.info("passed_count: %d, small success!"%passed_count)
                action("d d d", 100, 0.2)
                action("u u", 50, 0)
            elif passed_count == 4:
                logging.info("passed_count: %d, big success!"%passed_count)
                action("d d d", 100, 0.2)
                action("j j", 50, 0)
            elif passed_count == 5:
                logging.info("passed_count: %d, total success!"%passed_count)
                action("d d d", 100, 0.2)
                action("s+d s+a+u", 40, 4)
        else:
            action("d d d", 100, 0)
            action("Left Left Left", 100, 0)

        time.sleep(0.2)

def action(keysequence, delay, then_sleep_seconds):
    subprocess.call("xdotool key --clearmodifiers --window=%d --delay=%d %s"%(WINDOW_ID, delay, keysequence), shell=True)
    if then_sleep_seconds > 0: time.sleep(then_sleep_seconds)

def quit(signum, frame):
    KEEP_RUNNING = False
    time.sleep(1)
    logging.info("bye!")
    sys.exit()

def main():
    global WINDOW_ID

    signal.signal(signal.SIGINT, quit)
    signal.signal(signal.SIGTERM, quit)

    target_window = subprocess.check_output('xdotool search --name "^%s$"'%WINDOW_NAME, shell=True)
    if len(target_window) > 0:
        WINDOW_ID = int(target_window)
        code = subprocess.call('xdotool windowactivate %d'%WINDOW_ID, shell=True)

        websocket_thread = threading.Thread(target=websocket_listener)
        websocket_thread.setDaemon(True)
        websocket_thread.start()

        while KEEP_RUNNING and QUEUE_TRAVIS.qsize() < 100:
            logging.info("The controller is warming up...")
            time.sleep(1)

        logging.info("Warming up completed. Let's go?")
        raw_input("Press Enter to continue...")

        code = subprocess.call('xdotool windowactivate %d'%WINDOW_ID, shell=True)
        build_id_thread = threading.Thread(target=build_id_consumer)
        build_id_thread.setDaemon(True)
        build_id_thread.start()

        while KEEP_RUNNING:
            time.sleep(3)

        websocket_thread.join()
        build_id_thread.join()

        logging.info("bye!")

    else:
        logging.error("Emulator window not found")
        sys.exit(1)

    # action("s+d+u", 50, 2)
    # action("s+d+u", 50, 2)
    # action("d d d", 100, 1)
    # action("s+d s+a+u", 35, 3)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()