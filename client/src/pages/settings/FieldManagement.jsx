import { useEffect, useMemo, useState } from "react";

import CustomFieldDialog from "../../components/field-management/CustomFieldDialog";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestoreIcon from "@mui/icons-material/Restore";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import {
  getCustomFields,
  reorderCustomFields,
  archiveCustomField,
  restoreCustomField,
} from "../../services/customFieldService";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";


function FieldManagement() {

  const [fields, setFields] = useState([]);

  const [module, setModule] = useState("all");

  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedField, setSelectedField] = useState(null);

  const [dialogMode, setDialogMode] = useState("add");

  const [loading, setLoading] = useState(false);


  // =========================
  // Load Fields
  // =========================

  const loadFields = async () => {

    try {

      setLoading(true);

      const data = await getCustomFields();

      setFields(data || []);

    } catch (error) {

      console.error(
        "Load custom fields error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadFields();

  }, []);


  // =========================
  // Filter Fields
  // =========================

  const filteredFields = useMemo(() => {

    return fields.filter((field) => {

      const matchesModule =
        module === "all" ||
        field.module_key === module;

      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        field.field_label
          ?.toLowerCase()
          .includes(searchText) ||
        field.field_key
          ?.toLowerCase()
          .includes(searchText);

      return (
        matchesModule &&
        matchesSearch
      );

    });

  }, [fields, module, search]);


  // =========================
  // Add
  // =========================

  const handleAdd = () => {

    setSelectedField(null);

    setDialogMode("add");

    setOpenDialog(true);

  };


  // =========================
  // Edit
  // =========================

  const handleEdit = (field) => {

    setSelectedField(field);

    setDialogMode("edit");

    setOpenDialog(true);

  };


  // =========================
  // Hide / Restore
  // =========================

  const handleArchiveRestore = async (field) => {

    try {

      if (field.is_visible) {

        await archiveCustomField(field.id);

      } else {

        await restoreCustomField(field.id);

      }

      await loadFields();

    } catch (error) {

      console.error(
        "Archive/restore field error:",
        error
      );

    }

  };


  // =========================
  // Drag & Drop
  // =========================

  const handleDragEnd = async (result) => {

    if (!result.destination) {
      return;
    }


    // Search/filter ke time reorder nahi karenge
    if (search.trim()) {
      return;
    }


    const sourceIndex =
      result.source.index;

    const destinationIndex =
      result.destination.index;


    if (
      sourceIndex === destinationIndex
    ) {
      return;
    }


    const items =
      Array.from(filteredFields);


    const [movedItem] =
      items.splice(sourceIndex, 1);


    items.splice(
      destinationIndex,
      0,
      movedItem
    );


    /*
     * Important:
     * Sirf current module ke fields
     * reorder honge.
     */

    const reorderData =
      items.map((field, index) => ({
        id: field.id,
        display_order: index + 1,
      }));


    try {

      await reorderCustomFields(
        reorderData
      );

      await loadFields();

    } catch (error) {

      console.error(
        "Reorder custom fields error:",
        error
      );

      await loadFields();

    }

  };


  return (

    <Box>

      {/* =========================
          Header
      ========================= */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Field Management
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >
            Manage custom fields across CRM modules.
          </Typography>

        </Box>


        <Button
          variant="contained"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add Field
        </Button>

      </Box>


      {/* =========================
          Toolbar
      ========================= */}

      <Card sx={{ mb: 3 }}>

        <CardContent>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
          >

            <TextField
              fullWidth
              size="small"
              placeholder="Search fields..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <FormControl
              size="small"
              sx={{ minWidth: 220 }}
            >

              <InputLabel>
                Module
              </InputLabel>


              <Select
                value={module}
                label="Module"
                onChange={(e) =>
                  setModule(e.target.value)
                }
              >

                <MenuItem value="all">
                  All Modules
                </MenuItem>

                <MenuItem value="customer">
                  Customer
                </MenuItem>

                <MenuItem value="service">
                  Service
                </MenuItem>

                <MenuItem value="product">
                  Product
                </MenuItem>

                <MenuItem value="order">
                  Order
                </MenuItem>

                <MenuItem value="payment">
                  Payment
                </MenuItem>

              </Select>

            </FormControl>

          </Stack>

        </CardContent>

      </Card>


      {/* =========================
          Fields
      ========================= */}

      <Card>

        <CardContent>

          {filteredFields.length === 0 ? (

            <Box
              sx={{
                minHeight: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

              <Box textAlign="center">

                <TuneIcon
                  sx={{
                    fontSize: 56,
                    color: "text.secondary",
                    mb: 1,
                  }}
                />


                <Typography variant="h6">

                  {loading
                    ? "Loading fields..."
                    : "No custom fields found"}

                </Typography>


                {!loading && (

                  <>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mt={1}
                      mb={2}
                    >
                      Create custom fields for your CRM modules.
                    </Typography>


                    <Button
                      variant="contained"
                      onClick={handleAdd}
                      startIcon={<AddIcon />}
                    >
                      Create Your First Field
                    </Button>

                  </>

                )}

              </Box>

            </Box>

          ) : (

            <DragDropContext
              onDragEnd={handleDragEnd}
            >

              <Droppable
                droppableId="custom-fields"
              >

                {(provided) => (

                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >

                    {/* Header */}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "60px 2fr 1fr 1fr 2fr 2fr 1fr 120px",
                        gap: 2,
                        alignItems: "center",
                        px: 2,
                        py: 1.5,
                        borderBottom:
                          "1px solid #e0e0e0",
                        fontWeight: 600,
                      }}
                    >

                      <Box>
                        Move
                      </Box>

                      <Box>
                        Field
                      </Box>

                      <Box>
                        Module
                      </Box>

                      <Box>
                        Type
                      </Box>

                      <Box>
                        Rules
                      </Box>

                      <Box>
                        Show In
                      </Box>

                      <Box>
                        Status
                      </Box>

                      <Box>
                        Actions
                      </Box>

                    </Box>


                    {filteredFields.map(
                      (field, index) => (

                        <Draggable
                          key={field.id}
                          draggableId={
                            String(field.id)
                          }
                          index={index}
                          isDragDisabled={
                            Boolean(search.trim())
                          }
                        >

                          {(provided, snapshot) => (

                            <Box
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              sx={{
                                display: "grid",
                                gridTemplateColumns:
                                  "60px 2fr 1fr 1fr 2fr 2fr 1fr 120px",
                                gap: 2,
                                alignItems: "center",
                                px: 2,
                                py: 1.5,
                                borderBottom:
                                  "1px solid #eeeeee",
                                backgroundColor:
                                  snapshot.isDragging
                                    ? "#f5f8ff"
                                    : "transparent",
                              }}
                            >

                              {/* Move */}

                              <Box>

                                <IconButton
                                  size="small"
                                  {...provided.dragHandleProps}
                                  disabled={
                                    Boolean(
                                      search.trim()
                                    )
                                  }
                                >

                                  <DragIndicatorIcon />

                                </IconButton>

                              </Box>


                              {/* Field */}

                              <Box>

                                <Typography
                                  fontWeight={600}
                                >
                                  {field.field_label}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {field.field_key}
                                </Typography>

                              </Box>


                              {/* Module */}

                              <Box>

                                <Chip
                                  label={
                                    field.module_key
                                  }
                                  size="small"
                                />

                              </Box>


                              {/* Type */}

                              <Box>

                                {field.field_type}

                              </Box>


                              {/* Rules */}

                              <Box
                                display="flex"
                                gap={0.5}
                                flexWrap="wrap"
                              >

                                {field.is_required && (
                                  <Chip
                                    label="Required"
                                    size="small"
                                    color="warning"
                                  />
                                )}

                                {field.is_unique && (
                                  <Chip
                                    label="Unique"
                                    size="small"
                                    color="info"
                                  />
                                )}

                                {field.is_identifier && (
                                  <Chip
                                    label="Identifier"
                                    size="small"
                                    color="primary"
                                  />
                                )}

                                {field.is_searchable && (
                                  <Chip
                                    label="Search"
                                    size="small"
                                  />
                                )}

                              </Box>


                              {/* Show In */}

                              <Box
                                display="flex"
                                gap={0.5}
                                flexWrap="wrap"
                              >

                                {Object.entries(
                                  field.show_in || {}
                                )
                                  .filter(
                                    ([, value]) =>
                                      value
                                  )
                                  .map(
                                    ([key]) => (

                                      <Chip
                                        key={key}
                                        label={key}
                                        size="small"
                                      />

                                    )
                                  )}

                              </Box>


                              {/* Status */}

                              <Box>

                                <Chip
                                  label={
                                    field.is_visible
                                      ? "Active"
                                      : "Hidden"
                                  }
                                  color={
                                    field.is_visible
                                      ? "success"
                                      : "warning"
                                  }
                                  size="small"
                                />

                              </Box>


                              {/* Actions */}

                              <Box>

                                <Tooltip title="Edit">

                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      handleEdit(
                                        field
                                      )
                                    }
                                  >

                                    <EditIcon />

                                  </IconButton>

                                </Tooltip>


                                {!field.is_system && (

                                  field.is_visible ? (

                                    <Tooltip title="Hide">

                                      <IconButton
                                        color="warning"
                                        onClick={() =>
                                          handleArchiveRestore(
                                            field
                                          )
                                        }
                                      >

                                        <VisibilityOffIcon />

                                      </IconButton>

                                    </Tooltip>

                                  ) : (

                                    <Tooltip title="Restore">

                                      <IconButton
                                        color="success"
                                        onClick={() =>
                                          handleArchiveRestore(
                                            field
                                          )
                                        }
                                      >

                                        <RestoreIcon />

                                      </IconButton>

                                    </Tooltip>

                                  )

                                )}

                              </Box>

                            </Box>

                          )}

                        </Draggable>

                      )
                    )}


                    {provided.placeholder}

                  </Box>

                )}

              </Droppable>

            </DragDropContext>

          )}

        </CardContent>

      </Card>


      {/* =========================
          Dialog
      ========================= */}

      <CustomFieldDialog
        open={openDialog}
        onClose={() =>
          setOpenDialog(false)
        }
        onSuccess={loadFields}
        mode={dialogMode}
        field={selectedField}
      />

    </Box>

  );

}


export default FieldManagement;