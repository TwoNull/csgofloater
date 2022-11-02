#include <gurobi_c++.h>
#include <iostream>

unsigned int n = 1000000, k = 10, t = 666;

int main() {
    auto X = new GRBVar[n];
    auto vals = new unsigned char[n];
    srand(42);
    for (int i = 0; i < n; i++)
        vals[i] = rand();

    try {
        GRBEnv env = GRBEnv();
        GRBModel model = GRBModel(env);
        model.set(GRB_StringAttr_ModelName, "k-sum solver");
        model.set(GRB_IntAttr_ModelSense, GRB_MINIMIZE);
        // if (n > 500) model.set(GRB_IntParam_Threads, 1);

        // Create the binary selection variables:
        for (int i = 0; i < n; i++)
            X[i] = model.addVar(0.0, 1.0, vals[i], GRB_BINARY, "x_" + std::to_string(i));
        model.update();// run update to use model inserted variables

        // Should select a k-tuple:
        GRBLinExpr expr = 0;
        for (int i = 0; i < n; i++)
            expr += X[i];
        model.addConstr(expr == k);

        // The selected values should sum to at least the target value:
        expr = 0;
        for (int i = 0; i < n; i++)
            expr += vals[i] * X[i];
        model.addConstr(expr >= t);

        model.update();// run update before optimize
        model.optimize();
        if (model.get(GRB_IntAttr_SolCount) == 0)// if the solver could not obtain a solution
            throw GRBException("Could not obtain a solution!", -1);

        std::cout << "Itens used:" << std::endl;
        for (int i = 0; i < n; i++)
            if (X[i].get(GRB_DoubleAttr_X) > 0.5)
                std::cout << i << " - of value " << (int) vals[i] << std::endl;
        std::cout << "Sum of " << model.getObjective().getValue() << std::endl;
    } catch (const GRBException &ex) {
        printf("Exception...\n");
        std::cout << ex.getMessage();
        exit(ex.getErrorCode());
    }
    delete[] X;
    return 0;
}
