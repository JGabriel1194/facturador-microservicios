
import { Routes, Route } from "react-router-dom";
import Clients from "../pages/Clients";
import Products from "../pages/Products";
import Billing from "../pages/billing/Billing";
import NewBilling from "../pages/billing/NewBilling";

const DashboardContent = (): JSX.Element => {
  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Routes>
              <Route path="clients" element={<Clients />} />
              <Route path="products" element={<Products />} />
              <Route path="billing" element={<Billing />} />
              <Route path="billing/invoice" element={<NewBilling/>} />
              <Route path="*" element={<h1>404</h1>} />
              <Route
                path="/"
                element={
                  <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Dashboard Content
                    </h2>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This is where your dashboard content goes.
                      </p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
