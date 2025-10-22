import { List, Datagrid, TextField, ImageField, EditButton,DeleteButton } from 'react-admin';

export const CarouselList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ImageField source="image_url" title="Carousel Image" />
      <TextField source="created_at" label="Uploaded On" />
      <EditButton/>
      
<DeleteButton />

    </Datagrid>
  </List>
);
