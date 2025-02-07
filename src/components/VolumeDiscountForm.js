"use client";
import { Box, Button, Card, DataTable, Form, FormLayout, Grid, Icon, Page, Select, Text, TextField } from "@shopify/polaris";
import { DeleteIcon, PlusCircleIcon } from "@shopify/polaris-icons";
import { useState } from "react";

export default function VolumeDiscountForm() {
  const [campaignName, setCampaignName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([
    { title: "", subtitle: "", label: "", quantity: 1, discountType: "None", amount: "" },
    { title: "", subtitle: "", label: "", quantity: 2, discountType: "None", amount: "" },
  ]);
  const [errors, setErrors] = useState({});

  const discountOptions = [
    { label: "None", value: "None" },
    { label: "% discount", value: "% discount" },
    { label: "Discount / each", value: "Discount / each" },
  ];

  const validateForm = () => {
    let newErrors = {};
    if (!campaignName.trim()) newErrors.campaignName = "Campaign Name is required";
    if (!title.trim()) newErrors.title = "Title is required";
    if (options.length === 0) newErrors.options = "At least one rule is required";

    options.forEach((option, index) => {
      if (!option.title.trim()) newErrors[`title_${index}`] = "Title is required";
      if (!option.quantity || isNaN(option.quantity)) newErrors[`quantity_${index}`] = "Quantity must be a number";
      if (option.discountType !== "None" && (!option.amount || isNaN(option.amount))) {
        newErrors[`amount_${index}`] = "Amount must be a number";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOption = () => {
    const lastQuantity = options.length > 0 ? options[options.length - 1].quantity : 0;
    setOptions([...options, { title: "", subtitle: "", label: "", quantity: lastQuantity + 1, discountType: "None", amount: "" }]);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, key, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) => (i === index ? { ...option, [key]: key === "quantity" ? parseInt(value, 10) || 1 : value } : option))
    );
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Saving data...", { campaignName, title, description, options });
      alert("API called successfully!");
    }
  };

  return (
    <Page title="Create volume discount">
      <Grid>
        {/* General */}
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <Card title="General">
            <Text as="h1" variant="headingMd">
              General
            </Text>
            <Form>
              <FormLayout>
                <TextField
                  label={
                    <span style={{ color: "black" }}>
                      Campaign <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={campaignName}
                  onChange={setCampaignName}
                  error={errors.campaignName}
                  autoComplete="off"
                  required
                />
                <TextField
                  label={
                    <span style={{ color: "black" }}>
                      Title <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={title}
                  onChange={setTitle}
                  error={errors.title}
                  autoComplete="off"
                  required
                />
                <TextField label="Description" value={description} onChange={setDescription} autoComplete="off" />
              </FormLayout>
            </Form>
          </Card>
        </Grid.Cell>

        {/* Preview */}
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <Card title="Preview">
            <Text as="h1" variant="headingMd">
              Preview
            </Text>

            <Text alignment="center" variant="headingMd">
              {title || "Buy more and save"}
            </Text>
            <Text variant="bodyMd">{description || "Apply for all products in store"}</Text>

            <DataTable
              columnContentTypes={["text", "text", "numeric", "text"]}
              headings={["Title", "Discount Type", "Quantity", "Amount"]}
              rows={options.map((i) => [
                i.title,
                i.discountType,
                i.quantity,
                i.amount + `${i.discountType === "% discount" ? " %" : i.discountType === "Discount / each" ? " $" : ""} ` || "-",
              ])}
            />
          </Card>
        </Grid.Cell>

        {/* Volume discount rule */}
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <Card padding={0}>
            <Box padding={400}>
              <Text as="h1" variant="headingMd">
                Volume discount rule
              </Text>
            </Box>
            {options.map((option, index) => (
              <Box style={{ borderTop: "2px solid #d0d0d0", background: "bg-fill-info", marginTop: "6px" }} key={index}>
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      backgroundColor: "#C70A24",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "0 0 3px 0",
                      position: "relative",
                      top: "-20px",
                      left: "-20px",
                      display: "inline-block",
                    }}
                  >
                    OPTION {index + 1}
                  </div>
                  <div style={{ float: "inline-end", cursor: "pointer" }}>
                    <Icon accessibilityLabel="Delete option" source={DeleteIcon} onClick={() => removeOption(index)} tone="base" />
                  </div>
                </div>

                <Box padding={400}>
                  <FormLayout>
                    <FormLayout.Group condensed>
                      <TextField
                        label={
                          <span style={{ color: "black" }}>
                            Title <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={option.title}
                        onChange={(value) => updateOption(index, "title", value)}
                        error={errors[`title_${index}`]}
                        autoComplete="off"
                      />
                      <TextField
                        label="Subtitle"
                        value={option.subtitle}
                        onChange={(value) => updateOption(index, "subtitle", value)}
                        error={errors[`subtitle_${index}`]}
                        autoComplete="off"
                      />
                      <TextField
                        label="Label (Optional)"
                        value={option.label}
                        onChange={(value) => updateOption(index, "label", value)}
                        error={errors[`label_${index}`]}
                        autoComplete="off"
                      />
                      <TextField
                        label={
                          <span style={{ color: "black" }}>
                            Quantity <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="number"
                        value={option.quantity.toString()}
                        onChange={(value) => updateOption(index, "quantity", parseInt(value, 10))}
                        error={errors[`quantity_${index}`]}
                      />
                      <Select
                        label={
                          <span style={{ color: "black" }}>
                            Discount type <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        options={discountOptions}
                        value={option.discountType}
                        onChange={(value) => updateOption(index, "discountType", value)}
                      />

                      <div style={{ display: `${option.discountType === "None" ? "none" : "block"}` }}>
                        <TextField
                          label="Amount"
                          type="number"
                          suffix={option.discountType === "% discount" ? "%" : "$"}
                          value={option.amount}
                          onChange={(value) => updateOption(index, "amount", value)}
                          error={errors[`amount_${index}`]}
                        />
                      </div>
                    </FormLayout.Group>
                  </FormLayout>
                </Box>
              </Box>
            ))}

            <Button fullWidth variant="primary" tone="critical" onClick={addOption} icon={PlusCircleIcon}>
              Add option
            </Button>
            <Button fullWidth variant="primary" tone="success" onClick={handleSave}>
              Save
            </Button>
          </Card>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}
