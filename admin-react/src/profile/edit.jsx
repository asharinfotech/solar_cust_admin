import {
  Edit,
  SimpleForm,
  TextInput,
  ImageField,
  useRecordContext,
} from 'react-admin';
import { LogoUpload } from './Logoupload';

const ConditionalLogoUpload = () => {
  const record = useRecordContext();
  if (!record || record.key_name !== 'logo_url') return null;

  return <LogoUpload source="value" />;
};

export const SiteContentEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="key_name" disabled />
      <TextInput source="value" />
      <ImageField source="value" title="title" />
      <ConditionalLogoUpload />
    </SimpleForm>
  </Edit>
);
