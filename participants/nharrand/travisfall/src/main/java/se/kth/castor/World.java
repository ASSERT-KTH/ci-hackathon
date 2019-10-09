package se.kth.castor;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import se.kth.castor.message.AbstractMessage;
import se.kth.castor.message.MessageParsingException;
import se.kth.castor.message.TrajectoryChangeMessage;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

@WebSocket
public class World {

	//Default settings
	public static  double def_Friction = 0.8;

	public static double def_Player_Gravity = 0.4;
	public static int def_Player_Speed = 3;
	public static double def_Player_x = 500;
	public static double def_Player_y = 0;
	public static double def_Player_dx = 0;
	public static double def_Player_dy = 0;
	public static int def_Player_w = 25;
	public static int def_Player_h = 25;

	public static double def_Block_Gravity = 1;

	//Ugly singleton
	static World instance;

	public static World getInstance() {
		return instance;
	}

	public static void initInstance() {
		instance = new World();
		instance.initWorld();

		//start ticking?
	}

	//Actual World properties

	int worldHeight = 800;
	int worldWidth = 1400;

	int timestamp = 0;

	public int getTimestamp() {
		return timestamp;
	}

	PlayerRegistry registry = new PlayerRegistry();
	ArrayDeque<Block> blocks = new ArrayDeque<>();


	public void initWorld() {
		Block b0 = new Block(0x9999FF,25, 200, def_Block_Gravity, 400, 200, 0, 0);
		Block b1 = new Block(0x9999FF,25, 200, def_Block_Gravity, 200, 50, 0, 0);
		Block b2 = new Block(0x9999FF,25, 200, def_Block_Gravity, 600, 50, 0, 0);
		Block b4 = new Block(0x9999FF,200, 25, def_Block_Gravity, 380, 20, 0, 0);


		Block bottom = new Block(0x999999,25, worldWidth, 0, 25, 775, 0, 0);
		Block left = new Block(0x999999, worldHeight+200, 25, 0, 0, 0, 0, 0);
		Block right = new Block(0x999999, worldHeight+200, 25, 0, worldWidth - 25, 0, 0, 0);

		blocks.add(bottom);
		blocks.add(left);
		blocks.add(right);

		blocks.add(b0);
		blocks.add(b1);
		blocks.add(b2);
		blocks.add(b4);


	}


	public List<AbstractMessage> getCurrentWorldStatus() {
		int timestamp = 0;

		List<AbstractMessage> messages = new ArrayList<>();
		registry.players.values().stream().map(p -> p.getMessage(timestamp)).forEach(m -> messages.add(m));
		blocks.stream().map(b -> b.getMessage(timestamp)).forEach(m -> messages.add(m));

		return messages;
	}

	@OnWebSocketConnect
	public void onConnect(Session user) throws Exception {
		Player p = getInstance().registry.createNewPlayer(user);
		System.out.println("[WS] " + getInstance().registry.getPlayer(user).playerid + ": connected");
		AbstractMessage.sendTo(p.session, p.getIdAssignementMessage(getTimestamp()));
		getInstance().registry.broadCastMessage(p.getMessage(getTimestamp()));
		for(AbstractMessage m: getInstance().getCurrentWorldStatus()) {
			AbstractMessage.sendTo(p.session, m);
		}
	}

	@OnWebSocketClose
	public void onClose(Session user, int statusCode, String reason) {
		System.out.println("[WS] " + getInstance().registry.getPlayer(user).playerid + ": leaving");
		Player p = getInstance().registry.getPlayer(user);
		getInstance().registry.killPlayer(p.session);
		getInstance().registry.broadCastMessage(p.getPlayerDeathMessage(getTimestamp()));
	}

	@OnWebSocketMessage
	public void onMessage(Session user, String message) {
		System.out.println("[WS] " + getInstance().registry.getPlayer(user).playerid + ": \"" + message + "\"");
		try {
			AbstractMessage msg = AbstractMessage.parseMessage(message);
			System.out.println("[AbstractMessage] parsed " + msg.getClass().getName());
			if(msg instanceof TrajectoryChangeMessage) {
				TrajectoryChangeMessage tcm = (TrajectoryChangeMessage) msg;
				getInstance().registry.broadCastMessageMinusSender(msg, user);

				//trusting clients...
				Player p = getInstance().registry.getPlayer(tcm.playerId);
				p.x = tcm.x;
				p.y = tcm.y;
				p.dx = tcm.dx;
				p.dy = tcm.dy;
			}
		} catch (MessageParsingException e) {
			e.printStackTrace();
		}
	}

	public void tic() {

		for(Block b: blocks.clone()) {
			b.dy += b.gravity;
			b.y += b.dy;
			if(b.y > worldHeight) {
				blocks.remove(b);
				System.out.println("[World] remove block at (" + b.x + ", " + b.y + ")");
			}
		}

		for(Player p : registry.players.values()) {
			p.dx *= def_Friction;
			p.dy += p.gravity;
			p.x += p.dx;
			p.y += p.dy;
			if(p.y > worldHeight) {
				registry.killPlayer(p.session);
				registry.broadCastMessage(p.getPlayerDeathMessage(getTimestamp()));
				System.out.println("[World] kill player " + p.playerid + " at (" + p.x + ", " + p.y + ")");
			}
		}

		checkCollision();

		//create new Blocks

		timestamp++;
	}

	public void checkCollision() {

		for(Block b: blocks) {
			for(Player p : registry.players.values()) {
				double vX = (p.x + (p.w / 2)) - (b.x + (b.w / 2));
				double vY = (p.y + (p.h / 2)) - (b.y + (b.h / 2));
						// add the half widths and half heights of the objects
				double hWidths = (p.w / 2) + (b.w / 2);
				double hHeights = (p.h / 2) + (b.h / 2);

				// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
				if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
					// figures out on which side we are colliding (top, bottom, left, or right)
					double oX = hWidths - Math.abs(vX);
					double oY = hHeights - Math.abs(vY);

					if (oX >= oY) {
						if (vY > 0) {
							p.y += oY;
							p.dy = 0;
						} else {
							p.y -= oY;
							p.dy = 0;
						}
					} else {
						if (vX > 0) {
							p.x += oX;
							p.dx = 0;
						} else {
							p.x -= oX;
							p.dx = 0;
						}
					}

					//Broadcast collision to clients
					registry.broadCastMessage(p.getTrajectoryChangeMessage(getTimestamp()));
				}
			}
		}
	}
}
