import { useEffect, useState } from "react";

import StatusDialog from "../../components/customer-status/StatusDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestoreIcon from "@mui/icons-material/Restore";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import {
  getCustomerStatuses,
  deleteCustomerStatus,
  archiveCustomerStatus,
  restoreCustomerStatus,
  reorderCustomerStatus,
} from "../../services/customerStatusService";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function CustomerStatus() {
  const [statuses, setStatuses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dialogMode, setDialogMode] = useState("add");
  // const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const handleEdit = (status) => {
    setSelectedStatus(status);
    setDialogMode("edit");
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedStatus(null);
    setDialogMode("add");
    setOpenDialog(true);
  };

  const handleDeleteClick = (status) => {
    setDeleteStatus(status);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCustomerStatus(deleteStatus.id);

      enqueueSnackbar("Customer status deleted successfully", {
        variant: "success",
      });

      setOpenDeleteDialog(false);
      setDeleteStatus(null);

      loadStatuses();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const loadStatuses = async () => {
    try {
      //   const data = await getAllCustomerstatus();
      const data = await getCustomerStatuses();

      // console.log("API Data:", data);

      // setstatus(data);
      setStatuses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchive = async (id) => {
    try {
      await archiveCustomerStatus(id);

      enqueueSnackbar("Customer status archived successfully", {
        variant: "success",
      });

      loadStatuses();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreCustomerStatus(id);

      enqueueSnackbar("Customer status restored successfully", {
        variant: "success",
      });

      loadStatuses();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(statuses);

    const [movedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, movedItem);

    const updatedStatuses = items.map((status, index) => ({
      id: status.id,
      display_order: index + 1,
    }));

    try {
      await reorderCustomerStatus(updatedStatuses);

      loadStatuses();

      enqueueSnackbar("Customer status order updated successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  useEffect(() => {
    // console.log("Statuses State Changed:", statuses);
  }, [statuses]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >

<AppBreadcrumb
  items={[
    {
      label: "Settings",
      path: "/settings",
    },
    {
      label: "Customer Status",
    },
  ]}
/>


        <Typography variant="h4">Customer Status</Typography>
    
        <Button variant="contained" onClick={handleAdd}>
          + Add Status
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}>Move</TableCell>

                <TableCell>Order </TableCell>
                <TableCell>Status</TableCell>

                <TableCell>Color</TableCell>

                <TableCell>Default</TableCell>

                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <Droppable droppableId="customer-status">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {statuses.map((status, index) => (
                    <Draggable
                      key={status.id}
                      draggableId={status.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          key={status.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TableCell width={50}>
                            <IconButton
                              size="small"
                              {...provided.dragHandleProps}
                              sx={{ cursor: "grab" }}
                            >
                              <DragIndicatorIcon fontSize="small" />
                            </IconButton>
                          </TableCell>

                          <TableCell>{status.display_order}</TableCell>
                          <TableCell>{status.status_name}</TableCell>

                          <TableCell>
                            
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  backgroundColor: status.status_color,
                                  border: "1px solid #ccc",
                                }}
                              />
                              {status.status_color}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={status.is_default ? "Yes" : "No"}
                              color={status.is_default ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={status.is_active ? "Active" : "Inactive"}
                              color={status.is_active ? "primary" : "warning"}
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(status)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            {status.is_active ? (
                              <Tooltip title="Hide">
                                <IconButton
                                  color="warning"
                                  // disabled={status.is_system}
                                  onClick={() => handleArchive(status.id)}
                                >
                                  <VisibilityOffIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Restore">
                                <IconButton
                                  color="success"
                                  disabled={status.is_system}
                                  onClick={() => handleRestore(status.id)}
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(status)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </TableContainer>
      </DragDropContext>

      <StatusDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={loadStatuses}
        mode={dialogMode}
        selectedStatus={selectedStatus}
      />

      <ConfirmDialog
        open={openDeleteDialog}
        title="Delete Customer Status"
        message={`Are you sure you want to delete "${deleteStatus?.status_name}"?`}
        confirmText="Delete"
        confirmColor="error"
        onClose={() => {
          setOpenDeleteDialog(false);
          setDeleteStatus(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default CustomerStatus;
