import React, {useState} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function BasicDateTimePicker() {
  // const [value, setValue] = useState(dayjs());
  const [newRoomDateEdited, setNewRoomDateEdited] = useState(dayjs());
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="Event Time"
        value={newRoomDateEdited}
        onChange={(newValue) => {
            setNewRoomDateEdited(newValue);
        }}
    />
</LocalizationProvider>
  );
}
