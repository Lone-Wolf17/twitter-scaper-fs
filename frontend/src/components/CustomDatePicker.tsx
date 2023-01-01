import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import React, { useState } from "react";

interface CustomDatePickerProps {
  initialValue: DateTime | null;
  label: string;
  onChange: (value: any) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  initialValue,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="fr">
      <DesktopDatePicker
        value={initialValue}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disableMaskedInput
        onChange={onChange}
        maxDate={new Date()}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              readOnly: true,
              placeholder: label,
            }}
            InputProps={{
              ...params.InputProps,
              //   className: "Mui-disabled",
            }}
            onClick={(e) => setOpen(true)}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
