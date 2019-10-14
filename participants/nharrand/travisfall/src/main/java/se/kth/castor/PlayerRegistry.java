package se.kth.castor;

import org.eclipse.jetty.websocket.api.Session;
import se.kth.castor.message.AbstractMessage;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

public class PlayerRegistry {
	Random r = new Random();
	int nextID = 0;
	Map<Session,Player> players = new ConcurrentHashMap<>();

	public Player getPlayer(Session session) {
		return players.get(session);
	}

	public Player getPlayer(int id) {
		for (Player p: players.values()) {
			if(p.playerid == id) {
				return p;
			}
		}
		return null;
	}

	public void killPlayer(Player p, int timestamp) {
		//broadCastMessage(p.getPlayerDeathMessage(timestamp));
		//players.remove(p.session);
		p.status = 0;
	}

	public void removePlayer(Player p) {
		players.remove(p.session);
	}

	public Player createNewPlayer(Session session, int x) {
		Player player;
		if(players.containsKey(session)) {
			player = players.get(session);
			player.status = 0;
			player.score = 0;

			player.gravity = World.def_Player_Gravity;
			player.speed = World.def_Player_Speed;
			player.maxSpeed = World.def_Player_maxSpeed;
			player.jump = World.def_Player_Jump;
			player.h = World.def_Player_h;
			player.w = World.def_Player_w;
			player.x = x;
			player.y = World.def_Player_y;
			player.dx = World.def_Player_dx;
			player.dy = World.def_Player_dy;
			player.heartbeat = Player.TIMEOUT;
			player.deathAck = false;
			player.death++;
		} else {
			int col1 = r.nextInt(256*256*256-1);
			int col2 = r.nextInt(256*256*256-1);

			player = new Player(nextID, col1, col2,
					World.def_Player_Gravity,
					World.def_Player_Speed,
					World.def_Player_maxSpeed,
					World.def_Player_Jump,
					World.def_Player_h,
					World.def_Player_w,
					x,
					World.def_Player_y,
					World.def_Player_dx,
					World.def_Player_dy,
					session);
			players.put(session, player);
			nextID++;
		}
		return player;
	}

	public void broadCastMessage(AbstractMessage message) {
		for(Player p: players.values()) {
			AbstractMessage.sendTo(p.session, message);
		}
	}

	public void broadCastMessageMinusSender(AbstractMessage message, Session sender) {
		for(Player p: players.values()) {
			if(p.session != sender) {
				AbstractMessage.sendTo(p.session, message);
			}
		}
	}
}
