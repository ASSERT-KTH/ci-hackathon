#!/usr/bin/env sh
set -e
elm-app build
surge build/ xn--nl8h.haf.se
