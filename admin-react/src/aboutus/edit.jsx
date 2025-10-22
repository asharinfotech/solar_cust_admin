import { Edit, SimpleForm, TextInput } from 'react-admin';

import { Toolbar, SaveButton } from 'react-admin';

const CustomToolbar = () => (
  <Toolbar>
    <SaveButton />
    {/* No DeleteButton */}
  </Toolbar>
);

export const AboutUsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<CustomToolbar />}>
      <TextInput source="id" disabled />
      <TextInput source="section" disabled />
      <TextInput source="content" multiline />
    </SimpleForm>
  </Edit>
);
