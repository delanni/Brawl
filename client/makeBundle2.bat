rem this batch can be called from the project root
client\node_modules\.bin\browserify -e client\public\js\main.js -o client\public\js\bundle.js -d

rem browserify -e public/js/main.js -o public/js/bundle.js -d