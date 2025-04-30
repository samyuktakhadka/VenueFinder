import React, { useState } from "react";
import { Calendar } from "@demark-pro/react-booking-calendar";

import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";

// CSS Modules, react-booking-calendar-cssmodules.css
// import '@demark-pro/react-booking-calendar/dist/react-booking-calendar-cssmodules.css';

const oneDay = 86400000;
const today = new Date().getTime() + oneDay;

const reserved = Array.from({ length: 3 }, (_, i) => {
  const daysCount = Math.floor(Math.random() * (7 - 4) + 3);
  const startDate = new Date(today + oneDay * 8 * i);

  return {
    startDate,
    endDate: new Date(startDate.getTime() + oneDay * daysCount),
  };
});


const custom=[
    {
        startDate:new Date("2024-12-25"),
        endDate:new Date("2024-12-25"),
    }
        
];
console.log(custom);

const BookingCalendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);


  return (
    <>
    
    <Calendar
      selected={selectedDates}
      reserved={custom}
      onChange={setSelectedDates}
    />



<p>
    {selectedDates && selectedDates.length > 0 ? (
            <ul>
            {selectedDates.map((date, index) => (
                <li key={index}>{date instanceof Date ? date.toDateString() : date}</li>
            ))}
            </ul>
        ) : (
            <p>No dates selected</p>
        )}
</p>
   <button onClick={()=>{console.log(selectedDates)}}>click</button>

    </>
  );
};

export default BookingCalendar;