import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

export const UserEdit = () => (
  <Edit title="Edit User">
    <SimpleForm>
      <TextInput source="fullName" label="Full Name" />
      <TextInput source="email" label="Email" />
      <TextInput source="contactNumber" label="Contact Number" />
      <TextInput source="pincode" label="Pincode" />
      <TextInput source="city" label="City" />
      <TextInput source="query" label="Query" multiline />
    </SimpleForm>
  </Edit>
);
