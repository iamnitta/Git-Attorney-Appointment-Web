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
      const [startTime] = slotTime.split(' ')
      const endHour = parseInt(startTime) + 1;
      return `${startTime} - ${endHour}:00`
    }

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