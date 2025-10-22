import { Create, SimpleForm, TextInput } from 'react-admin';

export const AboutUsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="id" disabled />

      <TextInput source="section" />
      <TextInput source="content" multiline />
    </SimpleForm>
  </Create>
);
