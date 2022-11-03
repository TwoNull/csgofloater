import { exec, spawn } from "child_process";
import * as dotenv from "dotenv";
dotenv.config();

async function compileRunKSum() {
  exec(
    `g++ k_sum.cpp -L${process.env.GUROBI_LIB_DIR} -lgurobi_c++ -l${process.env.GUROBI_DYLIB_FILE} -I${process.env.GUROBI_INCLUDE_DIR}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      const child = spawn("./a.out");
      child.stdin.write("4 5");
      child.stdin.end();
      child.stdout.on("data", (data) => {
        console.log(`child stdout:\n${data}`);
      });
    }
  );
}
