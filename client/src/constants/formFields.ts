
export const formFields = [
    {
        name: "foodCourtName",
        label: "Name",
        id: "name-food-court",
        type: "text",
        placeholder: "Enter Name..",
    },
    {
        name: "email",
        label: "Email",
        id: "email",
        type: "email",
        placeholder: "Enter Email..",
    },
    {
        name: "managementDetails",
        label: "Management Details",
        id: "management-details",
        type: "text",
        placeholder: "Enter Management Details..",
    },
    {
        name: "address",
        label: "Address",
        id: "address",
        type: "text",
        placeholder: "Enter Address..",
    },
    {
        name: "location",
        label: "Location",
        id: "location",
        type: "text",
        placeholder: "Enter Location..",
    },
    {
        name: "password",
        label: "Password",
        id: "password",
        type: "password",
        placeholder: "Enter Password..",
    },
] as const;


export const restaurantFormFields = [
  {
    name: "restaurantName",
    label: "Name of restaurant",
    type: "text",
  },
  {
    name: "email",
    label: "Add Mail",
    type: "email",
  },
  {
    name: "ownerName",
    label: "Owner Name",
    type: "text",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
  },
  {
    name: "password",
    label: "Set Password",
    type: "password",
  },
] as const;

export const menuFormFields = [
  {
    name: "itemName",
    label: "Item Name",
    type: "text"
  },
  {
    name: "category",
    label: "Category",
    type: "text"
  },
    {
    name: "price",
    label: "Price",
    type: "number"
  },
    {
    name: "cost",
    label: "Cost",
    type: "number"
  },
    {
    name: "quantity",
    label: "Qty",
    type: "number"
  },
    {
    name: "description",
    label: "Description",
    type: "textarea"
  },

] as const 