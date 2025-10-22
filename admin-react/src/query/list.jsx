import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
} from 'react-admin';

export const UserList = (props) => (
  <List {...props} title="User Queries">
    <Datagrid rowClick="edit">
      <NumberField source="id" label="ID" />
      <TextField source="fullName" label="Full Name" />
      <TextField source="email" label="Email" />
      <TextField source="contactNumber" label="Contact Number" />
      <TextField source="pincode" label="Pincode" />
      <TextField source="city" label="City" />
      <TextField source="query" label="Query" />
      <TextField source="date" label="Date" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
