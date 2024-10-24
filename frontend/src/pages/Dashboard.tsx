import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardContent from "../components/DashboardContent";

const Dashboard = (): JSX.Element => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="mt-8">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
