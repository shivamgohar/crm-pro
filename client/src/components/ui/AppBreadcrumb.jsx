import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";

function AppBreadcrumb({ items = [] }) {
  const navigate = useNavigate();

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 3 }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.path) {
          return (
            <Typography
              key={item.label}
              color="text.primary"
              fontWeight={600}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={item.label}
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => navigate(item.path)}
            sx={{
              cursor: "pointer",
              border: "none",
              background: "none",
              p: 0,
              font: "inherit",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default AppBreadcrumb;