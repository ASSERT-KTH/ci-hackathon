package se.kth.castor;

import org.eclipse.jetty.websocket.api.Session;
import se.kth.castor.message.AbstractMessage;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class PlayerRegistry {
	Random r = new Random();
	int nextID = 0;
	Map<Session,Player> players = new HashMap<>();

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
		players.remove(p.session);
	}

	public Player createNewPlayer(Session session) {
		int col1 = r.nextInt(256*256*256-1);
		int col2 = r.nextInt(256*256*256-1);

		Player player = new Player(nextID, col1, col2,
				World.def_Player_Gravity,
				World.def_Player_Speed,
				World.def_Player_maxSpeed,
				World.def_Player_Jump,
				World.def_Player_h,
				World.def_Player_w,
				World.def_Player_x,
				World.def_Player_y,
				World.def_Player_dx,
				World.def_Player_dy,
				session);
		players.put(session, player);
		nextID++;
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
