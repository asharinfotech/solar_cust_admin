import { List, Datagrid, TextField, EditButton } from 'react-admin';

export const AboutUsList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="section" />
      <TextField source="content" />
      <EditButton />
    </Datagrid>
  </List>
);
