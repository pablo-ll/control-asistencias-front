import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

const StyledTimePicker = styled(TimePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '0.875rem',
    height: '28px',
   
  },
  '& .MuiInputBase-input': {
    padding: 0,
    textAlign: 'center',
  },
  '& .MuiIconButton-root': {
    padding: '2px',
    position: 'absolute',
    right: 12,
    top: 2,
    color: '#0000FF',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.875rem',
  },
}));

const CustomTimePicker = ({ label, value, onChange, row, check }) => {
   
    const handleTimeChange = (newValue) => {
      if (newValue) {
        const formattedTime = newValue.format('HH:mm');
        onChange(row.fecha, check, formattedTime);
      }
    };
  
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StyledTimePicker
          label={label}
          value={value ? dayjs(value, 'HH:mm') : dayjs('00:00', 'HH:mm')}
          onChange={handleTimeChange}
          ampm={false}
          views={['hours', 'minutes']}
          format="HH:mm"
          timeSteps={{ minutes: 1 }}
          slotProps={{
            textField: {
              variant: 'outlined',
              size: 'small',
              InputProps: {
                sx: {
                  bgcolor: '#eee',
                  border: '1px solid #ccc',
                  position: 'relative',
                  '& .MuiInputAdornment-root': {
                    marginRight: '0px',
                    marginLeft: 0,
                  },
                },
              },
              fullWidth: true,
            },
            minutesSection: {
              minutesStep: 1,
            },
          }}
        />
      </LocalizationProvider>
    );
  };
  
  export default CustomTimePicker;