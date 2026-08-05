import { useEffect, useState } from "react";

import FieldDialog from "../../components/customer-fields/FieldDialog";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestoreIcon from "@mui/icons-material/Restore";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppButton } from "../../components/ui";

import {
  Box,  
  Paper,
  Typography,
 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";


import {
    getAllCustomerFields,
  
    archiveCustomerField,
    restoreCustomerField,
    reorderCustomerFields,
} from "../../services/customerFieldService";


import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";


function CustomerFields() {
  const [fields, setFields] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
const [dialogMode, setDialogMode] = useState("add");
const navigate = useNavigate();


const handleEdit = (field) => {
    setSelectedField(field);
    setDialogMode("edit");
    setOpenDialog(true);
};

const handleAdd = () => {
    setSelectedField(null);
    setDialogMode("add");
    setOpenDialog(true);
};


  const loadFields = async () => {
    try {
      const data = await getAllCustomerFields();

      console.log("API Data:", data);

      setFields(data);
    } catch (error) {
      console.error(error);
    }
  };

const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(fields);

    const [movedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, movedItem);

    const updatedFields = items.map((field, index) => ({
        id: field.id,
        display_order: index + 1,
    }));

    await reorderCustomerFields(updatedFields);

    await loadFields();
};

  const handleArchiveRestore = async (field) => { 
  try {
    if (field.is_visible) {
      await archiveCustomerField(field.id);
    } else {
      await restoreCustomerField(field.id);
    }

    loadFields();
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    loadFields();
  }, []);

  useEffect(() => {
    console.log("Fields State Changed:", fields);
  }, [fields]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >



        <Typography variant="h4">Customer Fields</Typography>
           <AppButton
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/settings")}
        >
          Back
        </AppButton>

       <AppButton
    variant="contained"
    onClick={handleAdd}
>
    + Add Field
</AppButton>
      </Box>

   

      <DragDropContext onDragEnd={handleDragEnd}>

      <TableContainer component={Paper}>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell width={50}>Move</TableCell>
            <TableCell>Order</TableCell>

            <TableCell>Field</TableCell>

            <TableCell>Type</TableCell>
            <TableCell>Group</TableCell>
<TableCell>Show In</TableCell>

            <TableCell>Required</TableCell>

            <TableCell>Visible</TableCell>

            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>


<Droppable droppableId="customer-fields">
    {(provided) => (

        <TableBody  
          ref={provided.innerRef}
            {...provided.droppableProps}
        >
          {fields.map((field, index) => (
    <Draggable
        key={field.id}
        draggableId={field.id.toString()}
        index={index}
    > 
     {(provided) => (

            <TableRow key={field.id}
             ref={provided.innerRef}
                // {...provided.draggableProps}
                // {...provided.dragHandleProps}
              
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
              <TableCell>{field.display_order}</TableCell>

              <TableCell>{field.field_label}</TableCell>

              <TableCell>{field.field_type}</TableCell>
              <TableCell>
  <Chip
    label={
      field.field_group === "customer"
        ? "Customer"
        : "Service"
    }
    size="small"
    color={
      field.field_group === "customer"
        ? "primary"
        : "secondary"
    }
  />
</TableCell>

<TableCell>
  {Object.entries(field.show_in || {})
    .filter(([, value]) => value)
    .map(([key]) => (
      <Chip
        key={key}
        label={key}
        size="small"
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    ))}
</TableCell>

              <TableCell>
                <Chip
                  label={field.is_required ? "Yes" : "No"}
                  color={field.is_required ? "success" : "default"}
                  size="small"
                />
              </TableCell>

              <TableCell>
                <Chip
                  label={field.is_visible ? "Visible" : "Hidden"}
                  color={field.is_visible ? "primary" : "warning"}
                  size="small"
                />
              </TableCell>

             

<TableCell>

    <Tooltip title="Edit">
        <IconButton color="primary" 
        onClick={() => handleEdit(field)}>
            <EditIcon />
        </IconButton>
    </Tooltip>

    {field.is_visible ? (

        <Tooltip title="Hide">
            <IconButton color="warning" disabled={field.is_system} onClick={() => handleArchiveRestore(field)}>
                <VisibilityOffIcon />
            </IconButton>
        </Tooltip>

    ) : (

        <Tooltip title="Restore">
            <IconButton color="success" disabled={field.is_system} onClick={() => handleArchiveRestore(field)}>
                <RestoreIcon />
            </IconButton>
        </Tooltip>

    )}

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

      <FieldDialog
    open={openDialog}
    onClose={() => setOpenDialog(false)}
    onSuccess={loadFields}
    mode={dialogMode}
    field={selectedField}
/>
    </>
  );
}

export default CustomerFields;
