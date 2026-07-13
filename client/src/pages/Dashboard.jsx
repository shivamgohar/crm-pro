import DashboardCard from "../components/DashboardCard";

function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          color: "#d90606",
        }}
      >
        <DashboardCard title="Customers" value="120" />
        <DashboardCard title="Products" value="45" />
        <DashboardCard title="Orders" value="98" />
      </div>
    </>
  );
}

export default Dashboard;