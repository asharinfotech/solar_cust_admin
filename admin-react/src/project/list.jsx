import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ImageField,
  EditButton,
} from 'react-admin';

export const ProjectList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="type" />
      <TextField source="title" />
      <TextField source="category" />
      <TextField source="location" />
      <NumberField source="capacity" />
      <NumberField source="year" />
      <TextField source="description" />
      {/* <TextField source="src" /> */}
      {/* <TextField source="thumbnail" /> */}
      <ImageField source="image_url" title="title" />
      <EditButton/>
    </Datagrid>
  </List>
);
