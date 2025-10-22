import { Edit, SimpleForm, TextInput, } from 'react-admin';

export const SolaruserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="country" />
            <TextInput source="state" />
            <TextInput source="name" />
            <TextInput source="phone" />
            <TextInput source="city" />
            <TextInput source="pincode" />
            <TextInput source="solarFor" />
            <TextInput source="monthlyBill" />
           
                            
                        
        </SimpleForm>
         
    </Edit>
);
