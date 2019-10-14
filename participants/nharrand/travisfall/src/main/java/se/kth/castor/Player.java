package se.kth.castor;

import org.eclipse.jetty.websocket.api.Session;
import se.kth.castor.message.IdAssignementMessage;
import se.kth.castor.message.NewPlayerMessage;
import se.kth.castor.message.PlayerDeathMessage;
import se.kth.castor.message.TrajectoryChangeMessage;

public class Player {
	public static int TIMEOUT = 5*30;

	public String nick;
	public int heartbeat = TIMEOUT;
	public int status = 0;
	public boolean deathAck = false;

	public int playerid;
	public int color1;
	public int color2;
	public double gravity;
	public int jump;
	public double speed;
	public double maxSpeed;
	public int h,w;
	public double x, y, dx, dy;
	public long score = 0;
	public int kill = 0;
	public int death = 0;
	Session session;

	public Player(int playerid, int color1, int color2, double gravity, double speed, double maxSpeed, int jump, int h, int w, double x, double y, double dx, double dy, Session session) {
		this.playerid = playerid;
		this.color1 = color1;
		this.color2 = color2;
		this.gravity = gravity;
		this.jump = jump;
		this.speed = speed;
		this.maxSpeed = maxSpeed;
		this.h = h;
		this.w = w;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.session = session;
		this.nick = "anonymous";
	}

	public NewPlayerMessage getMessage(int timestamp) {
		return new NewPlayerMessage(timestamp,playerid,color1,color2,gravity,speed, maxSpeed,jump,h,w,x,y,dx,dy,score, nick, kill, death);
	}

	public TrajectoryChangeMessage getTrajectoryChangeMessage(int timestamp) {
		return new TrajectoryChangeMessage(timestamp,playerid,x,y,dx,dy);
	}

	public PlayerDeathMessage getPlayerDeathMessage(int timestamp, int responsibleId) {
		return new PlayerDeathMessage(timestamp,playerid,h,w,x,y, responsibleId);
	}

	public IdAssignementMessage getIdAssignementMessage(int timestamp) {
		return new IdAssignementMessage(timestamp,playerid);
	}
}
