import './App.css'
import React, { useState, useEffect } from "react"
import axios from "axios"
import DateTimePicker from "react-datetime-picker"
import { FaWhatsapp } from 'react-icons/fa';
function App() {

  const [ reminderdata, setReminderData ] = useState({
    title:'',
    message:'',
    phone:'',
    text:'Add',
    edit:false,
    editId:''
  })
  const [ remindAt, setRemindAt ] = useState()
  const [ reminderList, setReminderList ] = useState([])

  useEffect(() => {
      axios.get("https://remind-me-hackearth.herokuapp.com/getAllReminder").then( res => setReminderList(res.data))
  }, [])
  
  const {title,message,phone,text,edit,editId} = reminderdata;


  const setReminder = name => e => {
    setReminderData({...reminderdata,[name]:e.target.value})
  }



  const addReminder = () => {
    setReminderData({...reminderdata,text:'Adding'})
      axios.post("https://remind-me-hackearth.herokuapp.com/addReminder", { title,message,phone,remindAt })
      .then( res => setReminderList(res.data))
       setReminderData({...reminderdata,title:'',message:'',phone:'',text:'Added'})
      setRemindAt()

    setReminderData({...reminderdata,text:'Add'})
  }
  
  const EditRem=(reminder)=>{
    console.log(reminder)
    setReminderData({...reminderdata,edit:true,
      editId:reminder._id,
       title:reminder.reminderTxt,
       message:reminder.reminderMsg,
       phone:reminder.reminderPhn});

  }

  const deleteReminder = (id) => {
    axios.post("https://remind-me-hackearth.herokuapp.com/deleteReminder", { id })
    .then( res => setReminderList(res.data))
  }
  const editReminder=()=>{
    if(remindAt){
    setReminderData({...reminderdata,text:'Saving'})
      axios.put("https://remind-me-hackearth.herokuapp.com/editReminder", { title,message,phone,remindAt,editId })
      .then( res => console.log(res.data))
       setReminderData({...reminderdata,title:'',message:'',phone:'',edit:false})
      setRemindAt()
  } else {
    alert('Add reminder time first')
  }
}

  return (
    <div className="App">
      <div className="homepage">

        <div className="homepage_header">
          <h1>Remind Me 🙋‍♂️</h1>
          <input type="text" name="title" placeholder="Reminder title" value={title} onChange={setReminder('title')} />
          <input type="text" name="message" placeholder="Reminder message" value={message} onChange={setReminder('message')} />
          <input type="string" name="phone" placeholder="Whatsapp number" value={phone} onChange={setReminder('phone')} />
          <DateTimePicker 
            value={remindAt}
            onChange={setRemindAt}
            minDate={new Date()}
            minutePlaceholder="mm"
            hourPlaceholder="hh"
            dayPlaceholder="DD"
            monthPlaceholder="MM"
            yearPlaceholder="YYYY"
          />
          {edit &&  <div className="button" onClick={editReminder}>Save</div>}
          {!edit &&  <div className="button" onClick={addReminder}>{text}</div>}
        </div>


        <div className="homepage_body">
          {
           reminderList && reminderList.map( reminder => (
              <div className="reminder_card" key={reminder._id}>
                <h2>{reminder.reminderTxt}</h2>
                <p>{reminder.reminderMsg}</p>
                <small><FaWhatsapp/> {reminder.reminderPhn}</small>
                <h3>Remind Me at:</h3>
                <p>{String(new Date(reminder.remindAt.toLocaleString(undefined, {timezone:"Asia/Kolkata"})))}</p>
                <div className="button" onClick={() => EditRem(reminder)}>Edit</div>
                <div className="button" onClick={() => deleteReminder(reminder._id)}>Delete</div>
              </div>
            ))
          }
          

          
        </div>

      </div>
    </div>
  )
}

export default App;
