import { List, Datagrid, TextField,EditButton,ImageField } from 'react-admin';

export const SiteContentList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" disabled/>
      <TextField source="key_name"  />
      <TextField>
<TextField source="value" />
        <ImageField source="value"  />
      </TextField>
      
      <EditButton/>
    </Datagrid>
  </List>
);
