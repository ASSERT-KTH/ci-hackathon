package se.kth.castor;

import org.eclipse.jetty.websocket.api.Session;
import se.kth.castor.message.IdAssignementMessage;
import se.kth.castor.message.NewPlayerMessage;
import se.kth.castor.message.PlayerDeathMessage;
import se.kth.castor.message.TrajectoryChangeMessage;

public class Player {
	public int playerid;
	public int color1;
	public int color2;
	public double gravity;
	public int jump;
	public double speed;
	public int h,w;
	public double x, y, dx, dy;
	public long score = 0;
	public int cd;
	Session session;

	public Player(int playerid, int color1, int color2, double gravity, double speed, int jump, int h, int w, double x, double y, double dx, double dy, Session session) {
		this.playerid = playerid;
		this.color1 = color1;
		this.color2 = color2;
		this.gravity = gravity;
		this.jump = jump;
		this.speed = speed;
		this.h = h;
		this.w = w;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.session = session;
	}

	public NewPlayerMessage getMessage(int timestamp) {
		return new NewPlayerMessage(timestamp,playerid,color1,color2,gravity,speed,jump,h,w,x,y,dx,dy,score);
	}

	public TrajectoryChangeMessage getTrajectoryChangeMessage(int timestamp) {
		return new TrajectoryChangeMessage(timestamp,playerid,x,y,dx,dy);
	}

	public PlayerDeathMessage getPlayerDeathMessage(int timestamp) {
		return new PlayerDeathMessage(timestamp,playerid,h,w,x,y);
	}

	public IdAssignementMessage getIdAssignementMessage(int timestamp) {
		return new IdAssignementMessage(timestamp,playerid);
	}
}
