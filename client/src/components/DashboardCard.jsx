function DashboardCard({ title, value }) {
  return (
    <div
      style={{
        width: "220px",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;