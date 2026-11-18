// Helper loaded by src/runner/java.js. Precompiled into public/cotudy-runner-<N>.jar (bump N in public/java-frame.html when this changes):
//   javac -source 8 -target 8 -d /tmp/jh src/runner/java-helper/cotudy/Runner.java   (with JDK 11+; checked with JDK 17)
//   (runs on CheerpJ's Java 21 runtime, whose built-in javac it calls; Java 8 bytecode loads fine there)
//   jar cf public/cotudy-runner-<N>.jar -C /tmp/jh cotudy
package cotudy;
import java.io.*; import java.net.*; import java.lang.reflect.*;
public class Runner {
  public static String run(String code) throws Exception {
    File dir = new File("/files/run/");
    dir.mkdirs();
    new File("/files/src/").mkdirs();
    String src = "/files/src/Main.java";
    Writer w = new OutputStreamWriter(new FileOutputStream(src), "UTF-8");
    w.write(code);
    w.close();
    StringWriter log = new StringWriter();
    PrintWriter pw = new PrintWriter(log);
    int rc = com.sun.tools.javac.Main.compile(new String[] { src, "-d", "/files/run/", "-encoding", "UTF-8" }, pw);
    pw.flush();
    if (rc != 0) return "C" + log;
    PrintStream oldOut = System.out, oldErr = System.err;
    ByteArrayOutputStream buf = new ByteArrayOutputStream();
    PrintStream ps = new PrintStream(buf, true, "UTF-8");
    System.setOut(ps); System.setErr(ps);
    String status = "R";
    try {
      URLClassLoader cl = new URLClassLoader(new URL[] { dir.toURI().toURL() }, null);
      Method m = cl.loadClass("Main").getMethod("main", String[].class);
      m.invoke(null, (Object) new String[0]);
    } catch (InvocationTargetException e) {
      status = "X";
      ps.print("Exception in thread \"main\" ");
      e.getCause().printStackTrace(ps);
    } catch (Throwable t) {
      status = "X";
      t.printStackTrace(ps);
    } finally {
      ps.flush();
      System.setOut(oldOut); System.setErr(oldErr);
    }
    return status + buf.toString("UTF-8");
  }
}
