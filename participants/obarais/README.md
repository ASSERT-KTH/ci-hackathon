## General info

The first thing any DevOps engineer learns is a scripting language to navigate through devices, software and servers. These are exceptionally powerful and are the basics of learning development. 
Bash is a scripting language commonly used for programming in Linux. Linux scripts are used for automating certain programming tasks. They can also be used to simplify complex tasks and also help solve real-world problems. 

## Installation

You need:

- curl (curl is used in command lines or scripts to transfer data. )
- jq (jq is like sed for JSON data - you can use it to slice and filter and map and transform structured data with the same ease that sed, awk, grep and friends let you play with text.)
- [websocat](https://github.com/vi/websocat/releases) (Netcat, curl and socat for WebSockets.)

## Command

The first script prints programming language used in travys built in a temp file. 

```bash
websocat -S   "wss://travis.durieux.me" | jq .data.language > /tmp/test.log
```

The second script prints do an http request on the light server based on the programming language. 

```bash
export SERVER="http://192.168.0.157:8000/setcolor"
while IFS= read -r newline; do if [ $newline = "\"java\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"1\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"go\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"2\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"node_js\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"3\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"cpp\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"4\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"julia\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"5\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"c\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"6\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"python\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"7\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"ruby\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"8\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"android\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"9\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"c++\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"10\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"php\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"11\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"kotlin\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"12\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"rust\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"13\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"generic\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"14\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"elixir\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"15\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"bash\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"16\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"minimal\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"17\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"shell\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"18\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"r\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"19\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"scala\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"20\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"objective-c\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"21\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"perl\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"22\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   elif [ $newline = "\"haxe\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"23\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   else echo $newline ; curl -i -X POST -d "{\"id\": \"24\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;   fi  ; done < <(tail -n 1 -f /tmp/test.log )
```



## Source to modify

```bash
while IFS= read -r newline; do if [ $newline = "\"java\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"1\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"go\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"2\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"node_js\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"3\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"cpp\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"4\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"julia\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"5\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"c\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"6\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"python\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"7\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"ruby\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"8\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"android\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"9\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"c++\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"10\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"php\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"11\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"kotlin\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"12\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"rust\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"13\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"generic\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"14\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"elixir\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"15\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"bash\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"16\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"minimal\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"17\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"shell\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"18\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"r\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"19\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"scala\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"20\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"objective-c\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"21\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"perl\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"22\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
elif [ $newline = "\"haxe\"" ] ; then echo $newline ; curl -i -X POST -d "{\"id\": \"23\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
else echo $newline ; curl -i -X POST -d "{\"id\": \"24\", \"color\": [$(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 )), $(( ( RANDOM % 254 )  + 1 ))], \"session\": \"main\"}" $SERVER ;  
fi  ; done < <(tail -n 1 -f test.log )
```