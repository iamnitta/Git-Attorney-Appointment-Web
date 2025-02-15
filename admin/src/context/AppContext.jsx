import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const months = [' ', 'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

    //จัดรูปแบบวัน
    const slotDateFormat = (slotDate) => {
      const dateArray = slotDate.split('_')
      return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }
  
  //จัดรูปแบบเวลา
  const slotTimeFormat = (slotTime) => {
    const [startTime] = slotTime.split(" ");
    const hour = parseInt(startTime);
    if (startTime.endsWith(":30")) {
      return `${hour}:30 - ${hour + 1}:00`;
    }
    return `${hour}:00 - ${hour}:30`;
  };

    const value = {
        slotDateFormat,
        slotTimeFormat
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider