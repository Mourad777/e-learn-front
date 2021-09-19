import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox({options, label, onOptionChange, selectedOption, input, id,size, minWidth, width, margin}) {
  return (
    <Autocomplete
      // {...input}
      style={{width:'100%',marginBottom: 23}}
      id={id}
      size={size || "medium"}
      value={selectedOption || null}
      onChange={onOptionChange}
      options={options}
      getOptionLabel={(option) => option}
      // style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
    />
  );
}