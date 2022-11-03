#include <gurobi_c++.h>
#include <iostream>
#include <fstream>

int n = 0, k = 10, t = 0;

int main() {
    std::cin >> t;
    int value;
    std::ifstream Counter;
    Counter.open("../../data/raw.txt");
    while(Counter >> value)
        n++;
    Counter.close();
    auto X = new GRBVar[n];
    auto vals = new int[n];
    std::ifstream File;
    File.open("../../data/raw.txt");
    for (int i = 0; i < n; i++)
        File >> vals[i];
    File.close();
    try {
        GRBEnv env = GRBEnv();
        GRBModel model = GRBModel(env);
        model.set(GRB_StringAttr_ModelName, "k-sum solver");
        model.set(GRB_IntAttr_ModelSense, GRB_MINIMIZE);

        for (int i = 0; i < n; i++)
            X[i] = model.addVar(0.0, 1.0, vals[i], GRB_BINARY, "x_" + std::to_string(i));
        model.update();

        GRBLinExpr expr = 0;
        for (int i = 0; i < n; i++)
            expr += X[i];
        model.addConstr(expr == k);

        expr = 0;
        for (int i = 0; i < n; i++)
            expr += vals[i] * X[i];
        model.addConstr(expr >= t);

        model.update();
        model.optimize();
        if (model.get(GRB_IntAttr_SolCount) == 0)
            throw GRBException("Could not obtain a solution!", -1);

        for (int i = 0; i < n; i++)
            if (X[i].get(GRB_DoubleAttr_X) > 0.5)
                std::cout << i << " ";
    } catch (const GRBException &ex) {
        std::cout << ex.getMessage();
        exit(ex.getErrorCode());
    }
    delete[] X;
    return 0;
}