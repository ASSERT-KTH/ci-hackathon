package se.kth.castor;

import se.kth.castor.message.NewBlockMessage;

public class Block {
	static int nextId = 0;
	int boxId;
	int color;
	int h, w;
	double gravity;
	double x,y, dx, dy;
	int type;

	public Block(int color, int h, int w, double gravity, double x, double y, double dx, double dy, int type) {
		this.boxId = nextId++;
		this.color = color;
		this.h = h;
		this.w = w;
		this.gravity = gravity;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.type = type;
	}

	public NewBlockMessage getMessage(int timestamp) {
		return new NewBlockMessage(timestamp,boxId,color,h,w,gravity,x,y,dx,dy,type);
	}
}
