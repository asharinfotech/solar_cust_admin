import {
    List,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    TextInput,
    Filter,
    NumberField,
    ChipField,
    FunctionField,
    SimpleList,
} from 'react-admin';
import {
    Card,
    Chip,
    Box,
    Typography,
    useTheme,
    Stack,
    Divider,
    IconButton
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// 🔍 Filter Component
const SolarUserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <TextInput label="Name" source="name" />
        <TextInput label="City" source="city" />
        <TextInput label="State" source="state" />
        <TextInput label="Country" source="country" />
    </Filter>
);

// 📱 Mobile View
const MobileList = () => (
    <SimpleList
        primaryText={record => record.name}
        secondaryText={record => (
            <Stack spacing={1} sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption">{record.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption">
                        {record.city}, {record.state} - {record.pincode}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                        label={record.solarFor}
                        size="small"
                        sx={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            fontSize: '0.75rem'
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AttachMoneyIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                        <Typography variant="body2" fontWeight="medium">
                            {record.monthlyBill?.toLocaleString() || '0'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        {record.date}
                    </Typography>
                </Box>
            </Stack>
        )}
        tertiaryText={record => (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <EditButton label="" size="small" />
                <DeleteButton label="" size="small" />
            </Box>
        )}
        linkType="edit"
        rowSx={record => ({
            borderRadius: 2,
            mb: 1,
            backgroundColor: '#fff',
            boxShadow: 1,
            '&:hover': {
                boxShadow: 3,
                backgroundColor: '#f5f5f5'
            }
        })}
    />
);

// 💻 Desktop View
const DesktopDatagrid = () => (
    <Datagrid
        rowClick="edit"
        bulkActionButtons={true}
        sx={{
            '& .RaDatagrid-row:hover': {
                backgroundColor: '#e3f2fd',
                cursor: 'pointer',
            },
        }}
    >
        <TextField source="id" label="ID" />

        <FunctionField
            label="Customer"
            render={record => (
                <Box>
                    <Typography variant="body2" fontWeight="bold">
                        {record.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14 }} />
                        {record.phone}
                    </Typography>
                </Box>
            )}
        />

        <FunctionField
            label="Location"
            render={record => (
                <Box>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 16 }} />
                        {record.city}, {record.state}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {record.country} - {record.pincode}
                    </Typography>
                </Box>
            )}
        />

        <ChipField
            source="solarFor"
            label="Solar Type"
            sx={{
                '& .MuiChip-root': {
                    backgroundColor: '#4caf50',
                    color: 'white',
                }
            }}
        />

        <FunctionField
            label="Monthly Bill"
            render={record => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoneyIcon sx={{ fontSize: 18, color: '#ff9800' }} />
                    <Typography variant="body2" fontWeight="medium">
                        {record.monthlyBill?.toLocaleString() || '0'}
                    </Typography>
                </Box>
            )}
            textAlign="right"
        />

        <TextField source="date" label="Date" />

        <FunctionField
            label="Actions"
            render={record => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <EditButton label="" />
                    <DeleteButton label="" />
                </Box>
            )}
            textAlign="center"
        />
    </Datagrid>
);

// 🚀 Main List Component
export const SolaruserList = () => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <List
            filters={<SolarUserFilter />}
            perPage={25}
            sort={{ field: 'name', order: 'ASC' }}
            sx={{
                '& .RaDatagrid-headerCell': {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                },
                '& .RaDatagrid-rowEven': {
                    backgroundColor: '#fafafa',
                },
                '& .RaList-content': {
                    backgroundColor: isSmall ? '#f5f5f5' : 'transparent',
                    padding: isSmall ? 1 : 0,
                }
            }}
        >
            {isSmall ? <MobileList /> : <DesktopDatagrid />}
        </List>
    );
};
