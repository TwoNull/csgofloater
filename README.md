# csgofloater
csgofloater is a utility to aid in the crafting of weapon skins with very specific float values.

## Requirements

Must have [Node.js 18+ and NPM](https://nodejs.org/en/download/)

Must also install a licensed copy of [Gurobi Optimizer](https://www.gurobi.com/downloads/gurobi-software/)

This software has not been tested on Windows. If you are running Windows, you will have to install the GNU C++ Compiler using [This Guide](https://www3.cs.stonybrook.edu/~alee/g++/g++.html)

## Installation

clone the repository

```bash
git clone https://github.com/0xDarkTwo/csgofloater.git
```

cd into the project folder and install the dependencies via NPM

```bash
cd csgofloater
npm install
```

edit the `.env` file with the directories from your Gurobi installation. The default values are from a MacOS environment running Gurobi 9.5.2.

`GUROBI_INCLUDE_DIR` is the directory containing `gurobi_c.h` and `gurobi_c++.h`

`GUROBI_LIB_DIR` is the directory containing `libgurobi_c++.a`

inside of the `GUROBI_LIB_DIR` directory, there is a file `libgurobiXX.dylib`. the `GUROBI_DYLIB_FILE` variable should be set to `gurobiXX` where XX is the two numbers at the end of the filename

## Usage
run the csgofloater interface:

```
npm start
```

## License
[MIT](https://choosealicense.com/licenses/mit/)