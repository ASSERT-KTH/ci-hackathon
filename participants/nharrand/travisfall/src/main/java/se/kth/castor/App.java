package se.kth.castor;

import static spark.Spark.init;
import static spark.Spark.port;
import static spark.Spark.staticFileLocation;
import static spark.Spark.webSocket;

public class App  {
    static  int PORT = 8060;

    public static void main(String[] args) {
        System.out.println("[Server] starting on port " + PORT);
        port(PORT);
        staticFileLocation("/client"); //index.html is served at localhost:4567 (default port)

        World.initInstance();

        webSocket("/game", World.class);
        init();
        System.out.println("[Server] Started");
    }
}
