package se.kth.castor;

import java.util.Timer;
import java.util.TimerTask;

import static spark.Spark.init;
import static spark.Spark.port;
import static spark.Spark.staticFileLocation;
import static spark.Spark.webSocket;

public class App  {
    static int PORT = 8060;
    static long fps = 30;

    public static void main(String[] args) {
        System.out.println("[Server] starting on port " + PORT);
        port(PORT);
        staticFileLocation("/client");

        LightController.init();

        World.initInstance();

        webSocket("/game", World.class);
        init();
        System.out.println("[Server] Started");


        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                World.getInstance().tic();
            }
        }, 0, 1000/fps);

        WebsocketClient.init(new String[0]);

    }
}
