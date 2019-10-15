package main

import (
	"sync"
	"bufio"
	"encoding/json"
	"os"
	"log"
	"net/http"
	"fmt"
)

const MaxItems = 30

type Line struct {
	Data map[string]int64
}

type Data struct {
	Fields map[string]struct{}
	Lines []Line
	Mutex *sync.Mutex
}

func main() {
	data := &Data{
		make(map[string]struct{}),
		make([]Line, 0, MaxItems),
		&sync.Mutex{},
	}
	go startWebserver(data)
	readInput(data)
}

func startWebserver(data *Data) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, os.Args[1])
	})
	http.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		data.Mutex.Lock()

		var simplifiedData struct {
			Data []map[string]string
		}
		simplifiedData.Data = make([]map[string]string, len(data.Lines))

		for i, d := range data.Lines {
			simplifiedData.Data[i] = make(map[string]string)
			for k, v := range d.Data {
				simplifiedData.Data[i][k] = fmt.Sprintf("%d", v)
			}
			for field := range data.Fields {
				// TODO: Normalize all samples on write instead if a new field is added.
				if _, exist := simplifiedData.Data[i][field]; !exist {
					simplifiedData.Data[i][field] = "0"
				}
			}
			simplifiedData.Data[i]["Species"] = "setosa"
			simplifiedData.Data[i]["index"] = fmt.Sprintf("%d", i)
		}

		js, err := json.Marshal(simplifiedData)
		if err != nil {
			log.Fatalln("Unable to marshal data.")
		}
		data.Mutex.Unlock()

		w.Header().Set("Content-Type", "application/json")
  		w.Write(js)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func readInput(data *Data) {
	i := 0
	reader := bufio.NewReader(os.Stdin)
	for {
		text, err := reader.ReadBytes('\n')
		if err != nil {
			log.Fatalln(err)
		}

		fromLine := make(map[string]int64)
		if jsonErr := json.Unmarshal(text, &fromLine); jsonErr != nil {
			log.Println("Could not parse JSON. Ignoring. Error:", jsonErr)
			continue
		}

		newLine := Line{fromLine}

		data.Mutex.Lock()
		if len(data.Lines) < MaxItems {
			data.Lines = append(data.Lines, newLine)
		} else {
			data.Lines[i] = newLine
			i++
			if i >= MaxItems {
				i=0
			}
		}

		for field := range fromLine {
			// Never removing fields for now.
			data.Fields[field] = struct{}{}
		}

		log.Println(data.Lines)
		log.Println(data.Fields)
		data.Mutex.Unlock()
	}
}