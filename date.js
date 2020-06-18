//jshint esversion: 6



function date(){
   const options={
      weekday: 'long',
      day: 'numeric',
      month: 'long'
   };
   const today = new Date(); //.getDay();
   const listName = today.toLocaleDateString('en-US', options);
   //const days =['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
   //const dayName = days[today];

   return listName;
}


exports.date = date();
