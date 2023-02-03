import firebase from 'firebase/compat/app';
import { auth, db } from "/src/firebase/firebaseinit";
import {    collection, getDoc, updateDoc, onSnapshot, getFirestore, 
  query, where, orderBy, 
  doc, addDoc, deleteDoc, firestore } from "firebase/firestore";


export default {
    watch: {
      events() {
        this.loaded = true;
        if (this.deleting){
          this.loader();
        }
      }
      
    },
    data: () => ({
      loaded: false,
      userAuth: null,
      eventID: null,

      //Calendar Data
      date:null,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [
      ],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      
      //Add New Event Data
      new_event_date: null,
      new_event_name:"",
      new_event_location:"",
      new_event_description: "",
      add_event_snackbar: false,
      add_event_timeout: "3000",
      add_event_snackbar_text:  'New event added successfully.',

      add_event_error_snackbar: false,
      add_event_error_snackbar_text: 'Failed to add new event.',

      start_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      end_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      start_menu: false,
      end_menu: false,

      edited_event_name:"",

      edited_start_date: null,
      edited_start_time: "",
      edited_start_menu: false,

      edited_end_date: null,
      edited_end_time: "",
      edited_end_menu: false,

      edited_event_location:"",
      edited_event_description: "",

      edited_all_day_checkbox: false,

      start_time: "",
      start_time_items: ['12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM', '1:00 AM', '1:15 AM', '1:30 AM', '1:45 AM', '2:00 AM', '2:15 AM', '2:30 AM', '2:45 AM', '3:00 AM', '3:15 AM', '3:30 AM', '3:45 AM', '4:00 AM', '4:15 AM', '4:30 AM', '4:45 AM', '5:00 AM', '5:15 AM', '5:30 AM', '5:45 AM', '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM', '7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM', '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM', '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM', '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM', '8:15 PM', '8:30 PM', '8:45 PM', '9:00 PM', '9:15 PM', '9:30 PM', '9:45 PM', '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM', '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM'],
      end_time: "",
      end_time_items: ['12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM', '1:00 AM', '1:15 AM', '1:30 AM', '1:45 AM', '2:00 AM', '2:15 AM', '2:30 AM', '2:45 AM', '3:00 AM', '3:15 AM', '3:30 AM', '3:45 AM', '4:00 AM', '4:15 AM', '4:30 AM', '4:45 AM', '5:00 AM', '5:15 AM', '5:30 AM', '5:45 AM', '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM', '7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM', '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM', '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM', '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM', '8:15 PM', '8:30 PM', '8:45 PM', '9:00 PM', '9:15 PM', '9:30 PM', '9:45 PM', '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM', '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM'],
      all_day_checkbox: false,

      edit_event_snackbar: false,
      edit_event_timeout: "4000",
      edit_event_snackbar_text:  'Event updated successfully.',   

      edit_event_error_snackbar: false,
      edit_event_error_snackbar_text: 'Failed to edit event.',

      isEditing: false,

      deleteDialog: false,
      deleting: false,

      addEventValid: true,
      editEventValid: true,

      nameRules: [
        v => !!v || 'Event name is required',
      ],
      startTimeRules: [
        v => !!v || 'Start Time is required'
      ],
      endTimeRules: [
        v => !!v || 'End Time is required'
      ],

    }),
    mounted () {
      this.$refs.calendar.checkChange();
    },
    
    methods: {
      viewDay ({ date }) { // go to day view
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {  // focus on Today's date
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) { // when an event is clicked on
        const open = () => {
          console.log("happenign first");

          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))

          //Get start date
          this.edited_start_date = (this.selectedEvent.start).substr(0, 10);
          //Get end date
          this.edited_end_date = (this.selectedEvent.end).substr(0, 10);

          console.log("see this!", this.edited_start_date);
          console.log("see this!", this.edited_end_date);

          if (this.selectedEvent.all_day_checkbox==true){
            this.edited_start_time = "";
            this.edited_end_time = "";

          }else{

          
            //Get start date
            this.edited_start_time = (this.selectedEvent.start).substr(11, 16);
            //Get end date
            this.edited_end_time = (this.selectedEvent.end).substr(11, 16);

            console.log("see this!", this.edited_start_time);
            console.log("see this!", this.edited_end_time);

            //Get start time
              // Convert to 12H Format
              var hours = (this.edited_start_time).substr(0, 2); 
              // console.log(hours)
              var AmOrPm = hours >= 12 ? 'PM' : 'AM';
              hours = (hours % 12) || 12;
              // console.log(hours)

              var minutes = (this.edited_start_time).substring(3,5);
              var finalTime = hours + ":" + minutes + " " + AmOrPm; 
              this.edited_start_time = finalTime;

            //Get end time
              // Convert to 12H Format
              hours = (this.edited_end_time).substr(0, 2);
              // console.log(hours)
              AmOrPm = hours >= 12 ? 'PM' : 'AM';
              hours = (hours % 12) || 12;
              // console.log(hours)
              
              minutes = (this.edited_end_time).substring(3,5);
              finalTime = hours + ":" + minutes + " " + AmOrPm; 
              this.edited_end_time = finalTime;

          }
            //get Name, Location and Description
            // this.edited_event_name=this.selectedEvent.name;
            // this.edited_event_location=this.selectedEvent.location;
            // this.edited_event_description=this.selectedEvent.description;
            
            this.eventID=this.selectedEvent.id;

            getDoc(doc(db, "events", this.eventID))
                .then((doc) => {
                  console.log("happenign now");
                    this.edited_event_name = doc.data().name;
                    this.edited_event_location=doc.data().location;
                    this.edited_event_description=doc.data().description;
                })
                .catch(err => {
                    console.log(err);
                })

        }
  
        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }
  
        nativeEvent.stopPropagation()
      },
      
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },

      clear_new_event() {
        console.log("clear_new_event clicked");
        this.new_event_name = "";
        this.new_event_location = "";
        this.new_event_description = "";
        this.new_event_name = "";
        this.start_date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.end_date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.start_time = "";
        this.end_time = "";
        this.all_day_checkbox = false;
        this.$refs.addEventForm.resetValidation();

      },
      clear_time(){
        if (this.all_day_checkbox == true){
          this.start_time =" ";
          this.end_time =" ";
        }
        else{
          this.start_time ="";
          this.end_time ="";
        }
      },
      clear_time_edit(){
        if (this.edited_all_day_checkbox == true){
          this.edited_start_time =" ";
          this.edited_end_time =" ";
        }
        else{
          this.edited_start_time ="";
          this.edited_end_time ="";
        }
      },
      add_new_event(){
        this.$refs.addEventForm.validate();
        //console.log("validate",this.$refs.addEventForm.validate());
        
        if ((this.$refs.addEventForm.validate())==true) {
          auth.onAuthStateChanged(async (user) => {
            if (user === null) {
                // logging out user
                console.log(user);
            } else {
                this.userAuth = user;
                // console.log('userAuth:', this.userAuth.uid);

                // console.log("add_new_event clicked"); 
                // console.log('userAuth:', this.userAuth.uid);  
        
                // If 'All-day' event, make time empty
                if (this.all_day_checkbox==true){
                  this.start_time ="12:00 AM";
                  this.end_time ="11:45 PM";
                  // console.log("this.start_date: "+this.start_date);
                  // console.log("this.end_date: "+this.end_date);
                  // console.log("this.start_time: "+this.start_time);
                  // console.log("this.end_time: "+this.end_time);
                }
        
                //convert_ampm_to_24h
                
                    var time=this.start_time;
                    var hours = Number(time.match(/^(\d+)/)[1]);
                    var minutes = Number(time.match(/:(\d+)/)[1]);
                    var AMPM = time.match(/\s(.*)$/)[1];
                    if(AMPM == "PM" && hours<12) hours = hours+12;
                    if(AMPM == "AM" && hours==12) hours = hours-12;
                    var sHours = hours.toString();
                    var sMinutes = minutes.toString();
                    if(hours<10) sHours = "0" + sHours;
                    if(minutes<10) sMinutes = "0" + sMinutes;
                    // alert(sHours + ":" + sMinutes);
                    var start_datetime= this.start_date + " " + sHours + ":" + sMinutes;
                    
                    var startDate = new Date(start_datetime);
                    //startDate.setHours(sHours, sMinutes);
                    // console.log(startDate);
                  
                  
                    var time=this.end_time;
                    var hours = Number(time.match(/^(\d+)/)[1]);
                    var minutes = Number(time.match(/:(\d+)/)[1]);
                    var AMPM = time.match(/\s(.*)$/)[1];
                    if(AMPM == "PM" && hours<12) hours = hours+12;
                    if(AMPM == "AM" && hours==12) hours = hours-12;
                    var sHours = hours.toString();
                    var sMinutes = minutes.toString();
                    if(hours<10) sHours = "0" + sHours;
                    if(minutes<10) sMinutes = "0" + sMinutes;
                    // alert(sHours + ":" + sMinutes);
                    var end_datetime= this.end_date  + " " + sHours + ":" + sMinutes;
                    
                    var endDate = new Date(end_datetime);
                    //endDate.setHours(sHours, sMinutes);
                    // console.log(endDate);
                  var startSecs = firebase.firestore.Timestamp.fromDate(startDate).seconds;  
                  var endSecs = firebase.firestore.Timestamp.fromDate(endDate).seconds;

                  // convert string dates to firebase format
                  var startDateFirebase = firebase.firestore.Timestamp.fromDate(startDate);  
                  var endDateFirebase = firebase.firestore.Timestamp.fromDate(endDate);

                  // console.log(startSecs);
                  var timeValidation = true;

                  var errorArr = [];
                  console.log(errorArr);

                  if(startSecs > endSecs){
                    console.log('timeValidation = false');
                    timeValidation = false;
                    errorArr.push("End date/time cannot be before Start date/time!");
                  }

                  console.log(errorArr);

                  if (timeValidation){
                    addDoc(collection(db, 'events'), {
                      name: this.new_event_name,
                      start: startDateFirebase,
                      end: endDateFirebase,
                      color: this.colors[this.rnd(0, this.colors.length - 1)],
                      all_day_checkbox: this.all_day_checkbox, 
                      location: this.new_event_location,
                      description: this.new_event_description,
                      dialog: false,
                      uid: this.userAuth.uid
                    })
                    .then((snapshot) => {
                        this.clear_new_event();

                        // If successfully added to db,
                        this.add_event_snackbar= true;
                    })
                    .catch(err => {
                        console.log(err);
                        this.add_event_error_snackbar= true;
                    })
                  } else {
                    console.log("Error");
                    this.add_event_error_snackbar= true;
                    this.add_event_error_snackbar_text = errorArr.join(' ');
                    errorArr = [];
                    console.log(errorArr);
                  }
                
            }
          })

        }
        
        
    },
      editEvent() {
        this.isEditing=true;
      
      },
      cancel_editing() {
        this.isEditing=false;
      },
      getEvents(){
        console.log("getting events");

        auth.onAuthStateChanged(async (user) => {
          if (user === null) {
              // logging out user
              console.log(user);
          } else {
            console.log("user",user);

              this.userAuth = user;
              const colRef = collection(db, 'events')
              // queries
              const q = query(colRef, where('uid', '==', this.userAuth.uid),orderBy('start', 'asc'))
              // console.log('TROLL', this.userAuth)
              onSnapshot(q, (snapshot) => {
                  console.log(snapshot);
                  console.log(snapshot.docs);

                  this.events = [];
                  snapshot.docs.forEach((doc) =>{
                    //console.log("data", doc.data());
                      var document = doc.data();

                      //START DATE
                      var eventStartDate=document.start.toDate();
                      var offset = eventStartDate.getTimezoneOffset();
                      eventStartDate = new Date(eventStartDate.getTime() - (offset*60*1000));
                      
                      var isoStartDateFormat = (eventStartDate.toISOString()).split('T')[0]; //2022-11-01T07:15:00.000Z
                      
                      var isoStartTime;
                      if (document.all_day_checkbox==true){
                        isoStartTime="";
                        eventStartDate = isoStartDateFormat;
                      }else{
                        isoStartTime = ((eventStartDate.toISOString()).split('T')[1]).substring(0,5);
                        eventStartDate = isoStartDateFormat + " " + isoStartTime;
                      }
                      
                      // console.log("timeInISO", isoStartTime);
                      // console.log("ddateInISO", isoStartDateFormat);
                      
                      //END DATE
                      var eventEndDate=document.end.toDate();
                      var offset = eventEndDate.getTimezoneOffset();
                      eventEndDate = new Date(eventEndDate.getTime() - (offset*60*1000));
                      
                      var isoEndDateFormat = (eventEndDate.toISOString()).split('T')[0]; //2022-11-01T07:15:00.000Z
                      
                      var isoEndTime;
                      if (document.all_day_checkbox==true){
                        isoEndTime="";
                        eventEndDate = isoEndDateFormat;

                      }else{
                        isoEndTime = ((eventEndDate.toISOString()).split('T')[1]).substring(0,5);
                        eventEndDate = isoEndDateFormat + " " + isoEndTime;
                      }

                      // console.log("timeInISO", isoEndTime);
                      // console.log("ddateInISO", isoEndDateFormat);
                      
                      document.start = eventStartDate;
                      //console.log("document.start", document.start);

                      document.end = eventEndDate; //convert firebase date object to JS Date object
                      //console.log("document.end", document.end);

                      this.events.push({ ...document, id: doc.id});

                  })
                  console.log("look at this:",this.events);
              });
                }
            })      
        
      },
      update_event(){
        this.$refs.editEventForm.validate();
        console.log("edit valid",this.$refs.editEventForm.validate());//true

        if ((this.$refs.editEventForm.validate())==true) {

          auth.onAuthStateChanged(async (user) => {
            if (user === null) {
                // logging out user
                console.log(user);
            } else {
                this.userAuth = user;
                // console.log('userAuth:', this.userAuth.uid);

                // console.log("update_event clicked");
                // console.log('userAuth:', this.userAuth.uid);
        
                // console.log("doc.id:"+ doc.id);

                // If 'All-day' event, make time empty
                if (this.edited_all_day_checkbox==true){
                  this.edited_start_time ="12:00 AM";
                  this.edited_end_time ="11:45 PM";
                }
        
                //convert_ampm_to_24h
                    // start time
                    var time=this.edited_start_time;
                    var hours = Number(time.match(/^(\d+)/)[1]);
                    var minutes = Number(time.match(/:(\d+)/)[1]);
                    var AMPM = time.match(/\s(.*)$/)[1];
                    if(AMPM == "PM" && hours<12) hours = hours+12;
                    if(AMPM == "AM" && hours==12) hours = hours-12;
                    var sHours = hours.toString();
                    var sMinutes = minutes.toString();
                    if(hours<10) sHours = "0" + sHours;
                    if(minutes<10) sMinutes = "0" + sMinutes;
                    // alert(sHours + ":" + sMinutes);
                    var edited_start_datetime= this.edited_start_date + " " + sHours + ":" + sMinutes;
                    
                    var editedStartDate = new Date(edited_start_datetime);
                    //editedStartDate.setHours(sHours, sMinutes);
                    // console.log(editedStartDate);
                  
                    // end time
                    var time=this.edited_end_time;
                    var hours = Number(time.match(/^(\d+)/)[1]);
                    var minutes = Number(time.match(/:(\d+)/)[1]);
                    var AMPM = time.match(/\s(.*)$/)[1];
                    if(AMPM == "PM" && hours<12) hours = hours+12;
                    if(AMPM == "AM" && hours==12) hours = hours-12;
                    var sHours = hours.toString();
                    var sMinutes = minutes.toString();
                    if(hours<10) sHours = "0" + sHours;
                    if(minutes<10) sMinutes = "0" + sMinutes;
                    // alert(sHours + ":" + sMinutes);
                    var edited_end_datetime= this.edited_end_date  + " " + sHours + ":" + sMinutes;
                    
                    var editedEndDate = new Date(edited_end_datetime);
                    console.log(editedEndDate);

                    //editedEndDate.setHours(sHours, sMinutes);

                    console.log(editedEndDate);
                    // console.log("EVENTS", this.events);

                    var startSecs = firebase.firestore.Timestamp.fromDate(editedStartDate).seconds;  
                    var endSecs = firebase.firestore.Timestamp.fromDate(editedEndDate).seconds;

                    // console.log(startSecs);
                    var timeValidation = true;

                    var errorArr = [];
                    console.log(errorArr);

                    if(startSecs > endSecs){
                      console.log('timeValidation = false');
                      timeValidation = false;
                      errorArr.push("End date/time cannot be before Start date/time!");
                    }

                    if (timeValidation){

                      const newEventsRef = doc(db, "events", this.eventID);
                      updateDoc(newEventsRef, {
                        name: this.edited_event_name,
                        start: firebase.firestore.Timestamp.fromDate(editedStartDate),
                        end: firebase.firestore.Timestamp.fromDate(editedEndDate),
                        all_day_checkbox: this.edited_all_day_checkbox,
                        location: this.edited_event_location,
                        description: this.edited_event_description,
                      })
                      .then((snapshot) => {
                        //this.edit_event_snackbar= true;

                        this.selectedOpen=false;
                        this.isEditing=false; 
                        //this.$refs.calendar.checkChange();

                        location.reload();
                      })
                      .catch(err => {
                          console.log(err);
                          this.edit_event_error_snackbar= true;

                      })
                    } else {
                      console.log("Error");
                      this.edit_event_error_snackbar= true;
                      this.edit_event_error_snackbar_text = errorArr.join(' ');
                      errorArr = [];
                      console.log(errorArr);
                    }
            }
          })
        }
      },
      
      deleteEvent(){
          if (this.deleteDialog) {
              this.deleting = true;
          }
          const delEventsRef = doc(db, "events", this.eventID);
          deleteDoc(delEventsRef, {
          })
          .then((snapshot) => {
          })
          .catch(err => {
              console.log(err);
          })
          this.selectedOpen=false;
          this.getEvents();
      },

      loader() {
        this.deleting = false;
        if (this.deleteDialog) {
            this.deleteDialog = false;
        }
      },
      
      
    }, // end of methods
  
  }
