daemon() {
    chsum1=""

    while [[ true ]]
    do
        chsum2=`find gears.js -type f -exec md5 {} \;`
        if [[ $chsum1 != $chsum2 ]] ; then 
            echo "Building..."          
            npm run build
            chsum1=$chsum2
        fi
        sleep 1
    done
}

daemon