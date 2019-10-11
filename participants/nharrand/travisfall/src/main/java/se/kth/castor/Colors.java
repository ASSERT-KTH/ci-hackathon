package se.kth.castor;

public class Colors {

	public static int getColorForLang(String lang) {
		int col;
		switch (lang) {
			case "java":
				col = 0x4444AA;
				break;
			case "node_js":
				col = 0x44AA44;
				break;
			case "python":
				col = 0xAA4444;
				break;
			case "c":
				col = 0x44AAAA;
				break;
			case "cpp":
				col = 0xAA44AA;
				break;
			case "php":
				col = 0xAAAA44;
				break;
			case "kotlin":
				col = 0x444444;
				break;
			case "rust":
				col = 0xAAAAAA;
				break;
			case "go":
				col = 0xEEEEEE;
				break;
			case "generic":
				col = 0xEE55EE;
				break;

			case "ruby":
				col = 0xEEEE55;
				break;
			case "elixir":
				col = 0x55EEEE;
				break;
			case "bash":
				col = 0x5555EE;
				break;
			case "sh":
				col = 0xEE5555;
				break;

			default:
				System.out.println("no col for " + lang);
				col = 0x999999;
		}
		return col;
	}
}
