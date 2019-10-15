package se.kth.castor;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONObject;

import java.util.ArrayDeque;


@WebSocket(maxTextMessageSize = 64 * 1024)
public class ClientSocket {
	private boolean closed = false;
	public boolean isClosed() {
		return closed;
	}


	@SuppressWarnings("unused")
	private Session session;

	public ClientSocket()
	{

	}

	@OnWebSocketClose
	public void onClose(int statusCode, String reason)
	{
		System.out.printf("Connection closed: %d - %s%n", statusCode, reason);
		this.session = null;
		closed = true;
	}

	@OnWebSocketConnect
	public void onConnect(Session session)
	{
		System.out.printf("Got connect: %s%n", session);
		this.session = session;
		closed = false;
	}

	@OnWebSocketMessage
	public void onMessage(String msg)
	{
		try {
			JSONObject event = new JSONObject(msg);
			String lang = event.getJSONObject("data").getJSONObject("config").getString("language");
			int type = typeFromState(event.getJSONObject("data").getString("state"));
			if(World.getInstance().front.size() < World.MAX_FRONT) {
				World.getInstance().front.add(new World.BlockInfo(lang, type));
			} else if (World.getInstance().back.size() < World.MAX_BACK) {
				World.getInstance().back.add(new World.BlockInfo(lang, type));
			}

		} catch (Exception _ignore) {
			System.out.printf("Got msg: %s%n", msg);
		}
	}

	@OnWebSocketError
	public void onError(Throwable cause)
	{
		System.out.print("WebSocket Error: ");
		cause.printStackTrace(System.out);
	}

	public static int typeFromState(String state) {
		if(state == null) return 0;

		//System.out.println("caught build status: \"" + state + "\"");
		switch (state) {
			case "passed":
				return 1;

			case "errored":
			case "failed":
				return 2;

			default:
				return 0;
		}
	}
}