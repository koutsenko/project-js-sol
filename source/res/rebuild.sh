#!/bin/bash

RULE_SIZE='420px*320px'
FACE_SIZE='250px*300px'
MENU_SIZE='100px*100px'
PH_BIN='../../node_modules/phantomjs-prebuilt/bin/phantomjs'
PNG_BIN='../../node_modules/pngquant-bin/vendor/pngquant'
PNG_OPTS='--ext=.png --force --quality=64 --speed=1'
PH_JS='rasterize.js'
BASE_URL='http://localhost:8000/'
faces=(CK DK HK SK CQ DQ HQ SQ CJ DJ HJ SJ)
menus=(deal undo auto help records)
backs=(deck open back home stack)

python -m SimpleHTTPServer &
($PH_BIN $PH_JS ${BASE_URL}rule.svg#rule rule.png "${RULE_SIZE}" && $PNG_BIN rule.png $PNG_OPTS) &
for item in ${faces[*]}
do
  ($PH_BIN $PH_JS ${BASE_URL}face.svg#${item} face_${item}.png "${FACE_SIZE}" && $PNG_BIN face_${item}.png $PNG_OPTS) &
done
for item in ${menus[*]}
do
  ($PH_BIN $PH_JS ${BASE_URL}menu.svg#${item} menu_${item}.png "${MENU_SIZE}" && $PNG_BIN menu_${item}.png $PNG_OPTS) &
done
for item in ${backs[*]}
do
  ($PH_BIN $PH_JS ${BASE_URL}back.svg#${item} back_${item}.png "${FACE_SIZE}" && $PNG_BIN back_${item}.png $PNG_OPTS) &
done
