package se.kth.castor;

import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.eclipse.jetty.websocket.client.ClientUpgradeRequest;
import org.eclipse.jetty.websocket.client.WebSocketClient;

import java.net.URI;

public class WebsocketClient {

	public static void init(String[] args) {
		System.out.println("[TravisListerner] Start");
		while (true) {
			String destUri = "wss://travis.durieux.me";
			if (args.length > 0) {
				destUri = args[0];
			}
			SslContextFactory ssl = new SslContextFactory();
			WebSocketClient client = new WebSocketClient(ssl);
			ClientSocket socket = new ClientSocket();
			try {
				System.out.println("try");
				client.start();
				System.out.println("start");

				URI echoUri = new URI(destUri);
				ClientUpgradeRequest request = new ClientUpgradeRequest();
				client.connect(socket, echoUri, request);
				System.out.printf("Connecting to : %s%n", echoUri);

				boolean stop = false;

				while (!stop) {
					stop = socket.isClosed();
					Thread.sleep(1000);
				}
				Thread.sleep(1000);

			} catch (Throwable t) {
				t.printStackTrace();
			} finally {
				try {
					client.stop();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
}
