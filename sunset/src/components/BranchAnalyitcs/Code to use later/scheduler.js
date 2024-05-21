import React from 'react'

const scheduler = () => {
  return (
    <div>
        {/** 
            <div className='TopBarItem'>
                <span> 
                <span>
                
                {timeSchedule
                  .filter(schedule => {
                    const scheduledDate = new Date(schedule.Day); // Convert to Date object
                    const [startHour, startMinute] = schedule.start_time.split(':');
                    const [endHour, endMinute] = schedule.end_time.split(':');
          
                    scheduledDate.setHours(Number(startHour));
                    scheduledDate.setMinutes(Number(startMinute));
          
                    const currentNairobiTime = selectedDateTime;
          
                    return (
                      isSameDay(scheduledDate, currentNairobiTime) &&
                      isAfter(currentNairobiTime, scheduledDate) &&
                      isBefore(currentNairobiTime, new Date(scheduledDate).setHours(endHour, endMinute))
                    );
                  })
                  .map(schedule => {
                    const [endHour, endMinute] = schedule.end_time.split(':');
                    
                    return (
                      <div key={schedule.id}>
                        <p>Attendant: {schedule.User}</p>
                        <p>Shift ends at: {format(new Date(schedule.Day).setHours(Number(endHour), Number(endMinute)), 'HH:mm')}</p>
                      </div>
                    );
                  })}
                
                </span> </span>
            </div>
    */}
       
{/** 
            <div className='TopBarItem'>
                <span style={{display:'flex',justifyContent:'center',alignItems:'center'}}> <span>Schedule Shits</span> <button onClick={handleOpen} style={{
                    border:'none',
                    outline:'none',
                    backgroundColor:'#075985',
                    color:'white',
                    padding:'10px 10px',
                    borderRadius:'5px',
                    fontWeight:'bold'
                }}>Schedule</button> </span>
            </div>
*/}
    </div>
  )
}

export default scheduler
