import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  ImageField
} from 'react-admin';

export const ArticleList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      {/* <TextField source="excerpt" /> */}
      <TextField source="category" />
      <TextField source="author" />
      <TextField source="reading_time" />
      <TextField source="views" />
      <BooleanField source="featured" />
      <TextField source="tags" />
      <DateField source="published_date" />
            <ImageField source="image_url" title="title" />
      
    </Datagrid>
  </List>
);
