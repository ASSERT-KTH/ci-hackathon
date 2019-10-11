package se.kth.castor;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.StatusCode;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@WebSocket(maxTextMessageSize = 64 * 1024)
public class ClientSocket {
	private final CountDownLatch closeLatch;
	@SuppressWarnings("unused")
	private Session session;

	public ClientSocket()
	{
		this.closeLatch = new CountDownLatch(1);
	}

	public boolean awaitClose(int duration, TimeUnit unit) throws InterruptedException
	{
		return this.closeLatch.await(duration, unit);
	}

	@OnWebSocketClose
	public void onClose(int statusCode, String reason)
	{
		System.out.printf("Connection closed: %d - %s%n", statusCode, reason);
		this.session = null;
		this.closeLatch.countDown(); // trigger latch
	}

	@OnWebSocketConnect
	public void onConnect(Session session)
	{
		System.out.printf("Got connect: %s%n", session);
		this.session = session;
	}

	@OnWebSocketMessage
	public void onMessage(String msg)
	{
		System.out.printf("Got msg: %s%n", msg);
		if (msg.contains("Thanks"))
		{
			session.close(StatusCode.NORMAL, "I'm done");
		}
	}

	@OnWebSocketError
	public void onError(Throwable cause)
	{
		System.out.print("WebSocket Error: ");
		cause.printStackTrace(System.out);
	}
}