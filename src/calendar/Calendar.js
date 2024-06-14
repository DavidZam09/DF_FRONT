import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, differenceInYears } from 'date-fns';

const CalendarForm = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    if (isUnderage(date)) {
      alert('Debes ser mayor de edad para continuar');
    } else {
      setStartDate(date);
      const formattedDate = format(date, 'yyyy-MM-dd');
      onDateChange(formattedDate);
    }
  };

  const isUnderage = (date) => {
    const age = differenceInYears(new Date(), date);
    return age < 18;
  };

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        maxDate={new Date()} // Evita que elija fechas futuras
      />
    </div>
  );
};

export default CalendarForm;
