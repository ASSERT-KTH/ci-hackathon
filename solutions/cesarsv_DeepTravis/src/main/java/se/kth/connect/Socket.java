package se.kth.connect;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.StatusCode;
import org.eclipse.jetty.websocket.api.annotations.*;

import javax.json.Json;
import javax.json.JsonObject;
import java.io.StringReader;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Basic Echo Client Socket
 */
@WebSocket(maxTextMessageSize = 64 * 1024)
public class Socket {
    private final CountDownLatch closeLatch;
    private Session session;

    public Socket() {
        this.closeLatch = new CountDownLatch(1);
    }

    public boolean awaitClose(int duration, TimeUnit unit) throws InterruptedException {
        return this.closeLatch.await(duration, unit);
    }

    @OnWebSocketClose
    public void onClose(int statusCode, String reason) {
        System.out.printf("Connection closed: %d - %s%n", statusCode, reason);
        this.session = null;
        this.closeLatch.countDown(); // trigger latch
    }

    @OnWebSocketConnect
    public void onConnect(Session session) {
        System.out.printf("Got se.kth.connect: %s%n", session);
        this.session = session;
//        try {
//            Future<Void> fut;
//            fut = session.getRemote().sendStringByFuture("Hello");
//            fut.get(2, TimeUnit.SECONDS); // wait for send to complete.
//
//            fut = session.getRemote().sendStringByFuture("Thanks for the conversation.");
//            fut.get(2, TimeUnit.SECONDS); // wait for send to complete.
//        } catch (Throwable t) {
//            t.printStackTrace();
//        }
    }

    @OnWebSocketMessage
    public void onMessage(String msg) {
//        System.out.printf("Got msg: %s%n", msg);
        //        System.out.println("Received json: " + reader);

        processMessage(msg);

        // or do something more JSON-like:
        // String myField = json.getString("key");

        if (msg.contains("Thanks")) {
            session.close(StatusCode.NORMAL, "I'm done");
        }
    }

    @OnWebSocketError
    public void onError(Throwable cause) {
        System.out.print("WebSocket Error: ");
        cause.printStackTrace(System.out);
    }

    /**
     * JSON parser
     *
     * @param msg
     */
    private void processMessage(String msg) {
        JsonObject reader = Json.createReader(new StringReader(msg)).readObject();

        // First level
        System.out.println("Event: " + reader.getString("event"));

        // Second level
        JsonObject dataObject = reader.getJsonObject("data");
        System.out.println("State: " + dataObject.getString("state"));

        // Third level
        JsonObject configObject = dataObject.getJsonObject("config");
        System.out.println("Language: " + configObject.getString("language"));

    }
}