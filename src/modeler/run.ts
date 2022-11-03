import { exec, spawn } from "child_process";
import util from "util"
import fs from "fs";
import * as dotenv from "dotenv";
const execute = util.promisify(exec)
dotenv.config();

async function compileRunKSum(sumTarget: number) {
  if (!fs.existsSync("a.out")) {
    console.log('building')
    const { stdout, stderr } = await execute(`g++ k_sum.cpp -L${process.env.GUROBI_LIB_DIR} -lgurobi_c++ -l${process.env.GUROBI_DYLIB_FILE} -I${process.env.GUROBI_INCLUDE_DIR} -std=c++11`, {
      cwd: `${process.cwd()}/src/modeler`
    })
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return 'Error on build';
    }
  }
  return new Promise((resolve) => {
    let res = ''
    const child = spawn(`./a.out`, {
      cwd: `${process.cwd()}/src/modeler`
    });
    child.stdout.on("data", (data) => {
      res = data.toString()
    });
    child.on('close', (code) => {
      resolve(res)
    });
    child.stdin.write(String(sumTarget));
    child.stdin.end();
  });
}

async function run() {
  const res = await compileRunKSum(666666)
  console.log(res)
  if(res === 'Could not obtain a solution!') {
    throw new Error('No Solutions In Range')
  }
}
run()