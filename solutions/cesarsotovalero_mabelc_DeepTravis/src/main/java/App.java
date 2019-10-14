import se.kth.nst.NeuralStyleTransfer;

import java.io.IOException;
import java.net.URISyntaxException;

/**
 * Hello world!
 */
public class App {

    public static void main(String[] args) throws IOException, URISyntaxException {
        new NeuralStyleTransfer().transferStyle();
    }
}
