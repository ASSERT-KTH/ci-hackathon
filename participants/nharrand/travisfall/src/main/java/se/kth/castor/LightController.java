package se.kth.castor;


import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import org.json.JSONObject;

import java.util.Deque;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentLinkedDeque;

public class LightController {
	static LightController instance = new LightController();
	static Thread t = new Thread();
	static Deque<Callable> d = new ConcurrentLinkedDeque();

	public static void init() {
		Thread to = new Thread(() -> {
			while(true) {
				try {
					while (!d.isEmpty()) {
						d.poll().call();
						System.out.println("DO d");
					}
					Thread.sleep(100);
				} catch (InterruptedException e) {
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
		to.start();
	}

	static String url = "http://localhost:8000/setcolor";
	static String session = "main";
	static int first = 1;
	static int last = 24;


	public LightController() {

	}

	public static void  printAllRed() {
		d.add(() -> {
			LightController.allRed();
			return true;
		});
	}

	public static void  printPlayer(int color1, int color2) {
		d.add(() -> {
			LightController.print(color1, color2);
			return true;
		});
	}

	public static void allRed() {
		for(int i = first; i <= last; i++) {
			System.out.println("Light " + i);

			setColor(i,255,0,0);
		}
	}

	public static void print(int color1, int color2) {
		for(int i = first; i <= last; i++) {
			System.out.println("Light " + i);

			setColor(i,(color1 & 0xFF0000) >> 16,(color1 & 0x00FF00) >> 8,color1 & 0x0000FF);
		}
		setColor(15,(color2 & 0xFF0000) >> 16,(color2 & 0x00FF00) >> 8,(color2 & 0x0000FF));
		setColor(16,(color2 & 0xFF0000) >> 16,(color2 & 0x00FF00) >> 8,(color2 & 0x0000FF));
		setColor(9,(color2 & 0xFF0000) >> 16,(color2 & 0x00FF00) >> 8,(color2 & 0x0000FF));
		setColor(10,(color2 & 0xFF0000) >> 16,(color2 & 0x00FF00) >> 8,(color2 & 0x0000FF));

	}

	public static void setColor(int id, int r, int g, int b) {
		HttpResponse response = Unirest.post(url)
				.header("Content-Type", "application/json")
				.body(new JSONObject("{\"id\": \"" + id + "\", \"color\": [" + r + "," + g +", "+ b + "], \"session\": \"" + session + "\"}").toString())
				.asEmpty();

		System.out.println("Resp: " + response.getStatusText());
	}



	public static void main(String args[]) {
		System.out.println("Start");
		init();
		printAllRed();
		printPlayer(0x00FF00, 0x0000FF);
		System.out.println("Done");
	}

}
