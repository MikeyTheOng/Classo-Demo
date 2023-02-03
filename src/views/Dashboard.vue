<template>
    <div class="about">
        <div v-if="loader" data-aos="fade-up" data-aos-duration="500">
            <v-container class="pt-5" style="border-radius: 0.3rem;">
                <v-row justify="center">
                    <v-col cols="12" sm="12" md="4"
                        class="text-center col-xs-12 col-sm-12 col-md-4 scroll"
                        id="scheduleSection" 
                    >
                    <v-badge
                        :content="timeFocused"
                        :value="timeFocused"
                        color="#00AAA7"
                        light
                        overlap
                    >
                        <p class="text-h4 font-weight-normal ml-5 mr-5" style="color:#3C6563;">Today</p>
                    </v-badge>
                        <v-divider class="mb-3"></v-divider>
                        <div
                            style="height:90vh;overflow-y: auto; padding-left:5px; padding-right: 5px;"
                            class='scroll'
                        >
                            <div v-if="schedule.length==0">
                                <span class="text--disabled text-caption">
                                You do not have any events planned today. View your calendar
                                    <router-link class="disabledLink" :to="'../Calendar'">here</router-link>
                                </span>
                                <span class="text--disabled text-caption">.</span>
                            </div>
                            <v-dialog
                                v-model="event.dialog"
                                max-width="600"
                                v-for="event in schedule"
                                v-bind:key="event.id"
                            >
                                <template v-if="!event.isMultipleDays" v-slot:activator="{ on, attrs }">
                                    <v-card class="my-2 px-2 cardstyle">
                                        <v-card-title class="text-h6 pa-2 text-truncate" style="color:rgba(60, 101, 99, 1);">
                                            {{ event.name }}
                                        </v-card-title>

                                        <v-card-subtitle class="text-start caption pa-2 pb-0 pt-1 font-weight-medium" style="color:rgba(04 04 0, 0.7);">
                                            {{ String(event.start.toDate().getHours()).padStart(2, '0') }}:{{ String(event.start.toDate().getMinutes()).padStart(2, '0') }} - {{ String(event.end.toDate().getHours()).padStart(2, '0') }}:{{ String(event.end.toDate().getMinutes()).padStart(2, '0') }}
                                        </v-card-subtitle>
                                        <v-card-actions>
                                            <v-btn
                                                color="#CBD4CA"
                                                v-bind="attrs"
                                                v-on="on"
                                                x-small
                                            >
                                                <span class="font-weight-bold" style="color:#3C6563">Details</span>
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                                <template v-else v-slot:activator="{ on, attrs }">
                                    <v-card class="my-2 px-2 cardstyle" style="position: relative;">
                                        <v-row class="ma-0 pb-0">
                                            <v-col cols="7" class="ma-0 pa-0">
                                                <v-card-title class="text-h6 pl-2 pt-2 pb-0 ma-0 text-truncate" style="color:rgba(60, 101, 99, 1);">
                                                    {{ event.name }}
                                                    <!-- <v-spacer></v-spacer> -->
                                                </v-card-title>
                                            </v-col>
                                            <v-col cols="5" class="ma-0 pa-0 pt-3">
                                                <v-chip small dark label color="#C27D95" class="float-right">Multiple Day Event</v-chip>
                                            </v-col>
                                        </v-row>
                                        
                                        
                                        <v-card-subtitle class="text-start caption pa-2 pb-0 pt-1 font-weight-medium text-truncate" style="color:rgba(04 04 0, 0.7);">
                                            <div>
                                                From: {{ event.start.toDate().getDate() }} {{ shortMonthMap[event.start.toDate().getMonth()] }} {{ event.start.toDate().getFullYear() }}, {{ shortDayMap[event.start.toDate().getDay()] }}, {{ String(event.start.toDate().getHours()).padStart(2, '0') }}:{{ String(event.start.toDate().getMinutes()).padStart(2, '0') }}
                                            </div>
                                            <div>
                                                To: {{ event.end.toDate().getDate() }} {{ shortMonthMap[event.end.toDate().getMonth()] }} {{ event.end.toDate().getFullYear() }}, {{ shortDayMap[event.end.toDate().getDay()] }}, {{ String(event.end.toDate().getHours()).padStart(2, '0') }}:{{ String(event.end.toDate().getMinutes()).padStart(2, '0') }}
                                            </div>

                                        </v-card-subtitle>
                                        <v-card-actions>
                                                <v-btn
                                                color="#CBD4CA"
                                                v-bind="attrs"
                                                v-on="on"
                                                x-small
                                                >
                                                    <span class="font-weight-bold" style="color:#3C6563">Details</span>
                                                </v-btn>
                                                <v-spacer></v-spacer>
                                                <multipleDayChip :start="event.start" :end="event.end"></multipleDayChip>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                                <!-- What's in the dialog box for each event of the schedule-->
                                <v-overlay v-model="drawer"></v-overlay>
                                <v-card class="pa-4">
                                    <v-card-text class="pb-1">
                                            <p class="text-h6" style="color:rgba(60, 101, 99, 1); margin-bottom: 0px;">{{ event.name }}</p>
                                            <div class="text-subtitle-2"> From: {{ dayMap[event.start.toDate().getDay()] }}, {{ event.start.toDate().getDate() }} {{ monthMap[event.start.toDate().getMonth()] }} {{ event.start.toDate().getFullYear() }}, {{ String(event.start.toDate().getHours()).padStart(2, '0') }}:{{ String(event.start.toDate().getMinutes()).padStart(2, '0') }}</div>
                                            <div class="text-subtitle-2"> To: {{ dayMap[event.end.toDate().getDay()] }}, {{ event.end.toDate().getDate() }} {{ monthMap[event.end.toDate().getMonth()] }} {{ event.end.toDate().getFullYear() }}, {{ String(event.end.toDate().getHours()).padStart(2, '0') }}:{{ String(event.end.toDate().getMinutes()).padStart(2, '0') }}</div>
                                        <v-divider></v-divider>
                                        <!-- <p class="mt-2 mb-1 text-subtitle-1"><v-icon color="blue-grey lighten-3" class="pb-1">mdi-bell</v-icon> {{ event.reminder }}</p> -->
                                        <p class="mt-1 mb-1 text-subtitle-1"><v-icon color="blue-grey lighten-3" class="pb-1">mdi-map-marker-outline</v-icon> {{ event.location }}</p>
                                        <p>{{ event.description }}</p>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-btn
                                            color="#F06074"
                                            dark
                                            @click="event.dialog = false;delSnackbar();delEvent(event.id);"
                                        >
                                            <v-icon>
                                                mdi-trash-can
                                            </v-icon>
                                            delete
                                        </v-btn>
                                    <v-spacer></v-spacer>
                                        <v-btn
                                            dark
                                            color="#CBD4CA"
                                            outlined
                                            @click="event.dialog = false"
                                        >
                                            <span class="font-weight-bold" style="color:#3C6563">close</span>
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>                        
                    </v-col>

                    <v-col cols="12" sm="12" md="8"
                    class= "col-xs-12 col-sm-12 col-md-8"
                    id="myForumSection"
                    >
                        <p class="text-h4 font-weight-normal text-center" style="color:#3C6563;">My Subscriptions</p>
                        <v-divider class="mb-3"></v-divider>
                        <div
                            style="height:90vh;overflow-y: auto; padding-left:5px; padding-right: 5px;"
                            class='subScroll'
                        >
                            <p v-if="channels.length==0" class="text--disabled text-caption text-center">
                                You are not subscribed to any channels. Explore channels
                                <router-link class="disabledLink" :to="'../forum'">here</router-link>.
                            </p>
                            <div style="padding-left:5px; padding-right: 5px;">
                                <v-card v-for="channel in channels"
                                :key="channel.id"
                                class="pa-2 px-6 ma-2 mx-auto cardstyle"
                                >
                                    <v-card-text class="pb-1 mb-n3">
                                        <router-link class="nolink" :to="'/forum-channel/' + channel.id">
                                            <p class="text-h5 my-0 nolink">{{ channel.channel_title }}</p>
                                        </router-link>
                                        <v-divider></v-divider>
                                        <div class="d-flex justify-space-between">
                                            <p>
                                                Prof. {{ channel.user.user_name}}
                                            </p>
                                            <p class="text-right">posted on {{ channel.annDate }}</p>
                                        </div>

                                        <p class="text-body-2 mt-1" style="color: black;">{{ channel.channel_announcement }}</p>
                                    </v-card-text>
                                    <v-card-actions>
                                        <router-link class="nolink" :to="'/forum-channel/' + channel.id">
                                            <v-btn  
                                                class="ml-2 coursePageBtn"
                                                small
                                                outlined
                                            >
                                                <span class="font-weight-bold">visit course page</span>
                                            </v-btn>
                                        </router-link>
                                    </v-card-actions>
                                </v-card>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <v-snackbar v-model="snackbarDel" timeout="2000" left color="#F06074">
            Successfully <strong>deleted</strong> event.
            <template v-slot:action="{ attrs }">
                <v-btn
                text
                v-bind="attrs"
                @click="snackbarDel = false"
                >
                Close
                </v-btn>
            </template>
        </v-snackbar>
        <loading-overlay imageName="snail_loader.gif" type="animated" :loaded="loader"></loading-overlay>
    </div>
</template>
<script>
    import firebase from 'firebase/compat/app';
    import { auth, db } from "../firebase/firebaseinit"
    import {
        collection, getDocs, onSnapshot, getFirestore, 
        query, where, orderBy, 
        doc, addDoc, deleteDoc, firestore
    } from 'firebase/firestore'
    import multipleDayChip from "../components/multipleDayChip.vue";

    export default {
        components:{
            multipleDayChip
            },   
        watch: {
            schedule(){
                this.loader1=true;
            },
            channels(){
                this.loader2=true;
            }
        },
        data(){
            return {   
                loader1 : false,
                loader2 : false,
                userAuth : null,
                timeFocused : null,
                menu: false,
                modal: false,
                drawer: null,
                // for date picker
                // date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

                // for time (range slider)
                timeOptions : [
                    '12:00am',
                    '12:15am',
                    '12:30am',
                    '12:45am',
                    '1:00am',
                    '1:15am',
                    '1:30am',
                    '1:45am',
                    '2:00am',
                    '2:15am',
                    '2:30am',
                    '2:45am',
                    '3:00am',
                    '3:15am',
                    '3:30am',
                    '3:45am',
                    '4:00am',
                    '4:15am',
                    '4:30am',
                    '4:45am',
                    '5:00am',
                    '5:15am',
                    '5:30am',
                    '5:45am',
                    '6:00am',
                    '6:15am',
                    '6:30am',
                    '6:45am',
                    '7:00am',
                    '7:15am',
                    '7:30am',
                    '7:45am',
                    '8:00am',
                    '8:15am',
                    '8:30am',
                    '8:45am',
                    '9:00am',
                    '9:15am',
                    '9:30am',
                    '9:45am',
                    '10:00am',
                    '10:15am',
                    '10:30am',
                    '10:45am',
                    '11:00am',
                    '11:15am',
                    '11:30am',
                    '11:45am',
                    '12:00pm',
                    '12:15pm',
                    '12:30pm',
                    '12:45pm',
                    '1:00pm',
                    '1:15pm',
                    '1:30pm',
                    '1:45pm',
                    '2:00pm',
                    '2:15pm',
                    '2:30pm',
                    '2:45pm',
                    '3:00pm',
                    '3:15pm',
                    '3:30pm',
                    '3:45pm',
                    '4:00pm',
                    '4:15pm',
                    '4:30pm',
                    '4:45pm',
                    '5:00pm',
                    '5:15pm',
                    '5:30pm',
                    '5:45pm',
                    '6:00pm',
                    '6:15pm',
                    '6:30pm',
                    '6:45pm',
                    '7:00pm',
                    '7:15pm',
                    '7:30pm',
                    '7:45pm',
                    '8:00pm',
                    '8:15pm',
                    '8:30pm',
                    '8:45pm',
                    '9:00pm',
                    '9:15pm',
                    '9:30pm',
                    '9:45pm',
                    '10:00pm',
                    '10:15pm',
                    '10:30pm',
                    '10:45pm',
                    '11:00pm',
                    '11:15pm',
                    '11:30pm',
                    '11:45pm',
                ],

                // for snackbars
                snackbarDel : false,

                replace : null,
                today : null,
                schedule : [],
                channels : [],
                remindOptions : ['none', '10 minutes before', '15 minutes before', '30 minutes before', '1 hour before', '3 hours before', '6 hours before'],
                dayMap : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                shortDayMap : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                monthMap : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                shortMonthMap : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        },
        methods: {
            // addEvent(){
            //     console.log('addEvent')
            //     // var testDate = new Date('2022-10-12');

            //     // console.log(testDate);

            //     addDoc(collection(db, 'schedule'), {
            //             UID : 'S4iEUuCe6VWLjhA2d4wHmNcvHwn2',
            //             dialog : false,
            //             location : "home",
            //             remindTimeBefore: "none",
            //             eventName : 'Bogey',
            //             description : 'Test event Description',
            //             startDate: firebase.firestore.Timestamp.fromDate(new Date(2022, 10, 12, 15, 1)),
            //             endDate : firebase.firestore.Timestamp.fromDate(new Date(2022, 10, 12, 15, 2))
            //         })
            //         .then((snapshot) => {
            //             // console.log(snapshot);
            //             this.getSchedule();
            //         })
            //         .catch(err => {
            //             console.log(err);
            //         })
            // },
            delEvent(id){ // function name is f1
                console.log('delEvent', id);
                const delEventRef = doc(db, "events", id);
                deleteDoc(delEventRef, {
                    })
                    .then((snapshot) => {
                        this.getSchedule();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            delSnackbar(){
                this.snackbarDel=!this.snackbarDel;
            },
            // getUserObj(){
            //     auth.onAuthStateChanged(async (user) => {
            //         if (user === null) {
            //             // logging out user
            //             console.log(user);
            //         } else {
            //             this.userObj = user;
            //         }

            //         console.log(userObj);
            //     });
            // },
            getTodayDate(){
                const date = new Date();
                var tDate = String(date.getDate()) + '/' + String(date.getMonth()) + '/' + String(date.getFullYear());
                // this.today = tDate;

                // dummy data
                // for testing purposes, set this.today to 28/10
                // this.today = '28/9/2022';
                // this.today = '29/9/2022'
                // this.today = '30/9/2022'
            },
            getSchedule(userID){
                // import { auth, db } from "../firebase/firebaseinit"
                // import {
                //     collection, getDocs, getFirestore
                // } from 'firebase/firestore'

                // database already initiated in firebaseinitjs & init services 

                // collection ref
                const colRef = collection(db, 'events')
                // console.log(userID);
                // queries
                const q = query(colRef, where('uid', '==', userID),orderBy('start', 'asc'));
                
                onSnapshot(q, (snapshot) => {
                    // console.log(snapshot);
                    // console.log(snapshot.docs);

                    let todaySchedule = [];
                    snapshot.docs.forEach((doc) =>{
                        /* 
                            filter dates, we want events that startDates are before today and endDates are after today
                        */
                        // console.log(doc.data())
                        // if(doc.data().uid == userID){
                            const d = new Date();
                            // d.setHours(0,0,0,0);
                            var currDate = firebase.firestore.Timestamp.fromDate(d).seconds;
                            
                            var d1 = new Date();
                            d1.setHours(0,0,0,0);
                            var currDateMidnight = firebase.firestore.Timestamp.fromDate(d1).seconds; // 0000

                            var d2 = new Date();
                            d2.setHours(23,59,59,59);
                            var currDateMidnight2 = firebase.firestore.Timestamp.fromDate(d2).seconds; // 2359

                            if(doc.data().start.seconds >= currDateMidnight && doc.data().end.seconds <= currDateMidnight2){
                                if(currDate >= doc.data().start.seconds && currDate <= doc.data().end.seconds){
                                    todaySchedule.push({ ...doc.data(), id: doc.id, isMultipleDays : false });
                                } else if (doc.data().start.seconds > currDate){
                                    todaySchedule.push({ ...doc.data(), id: doc.id, isMultipleDays: false });
                                }
                            } else if (doc.data().start.seconds < currDateMidnight && doc.data().end.seconds >= currDate){
                                // event starts before today but ends after currDate
                                todaySchedule.push({ ...doc.data(), id: doc.id, isMultipleDays : true});
                            } else if (doc.data().start.seconds >= currDateMidnight && doc.data().start.seconds <= currDateMidnight2){
                                if(doc.data().end.seconds >= currDateMidnight2){
                                    // event starts today but ends after today
                                    todaySchedule.push({ ...doc.data(), id: doc.id, isMultipleDays : true});
                                }
                                
                            }
                        // }
                        
                        
                    })
                    
                    this.schedule = todaySchedule; 
                    // console.log(this.schedule[0])
                    if(this.schedule.length == 0){
                        // console.log("Schedule is empty!");
                        this.schedule == [];
                    }
                })
            },
            getMyForums(userID){
                // collection ref
                const colRef = collection(db, 'channel')

                // queries
                const q = query(colRef, orderBy('announcement_date', 'desc'))

                // real time collection
                getDocs(q)
                .then((snapshot) => {
                    // console.log(snapshot);
                    // console.log(snapshot.docs);

                    let tempChannels = [];
                    // let count = 0;
                    snapshot.docs.forEach((doc) =>{
                        /* 
                            filter dates, we only want events that fall on today's date
                        */
                        // console.log(doc.data().channel_members);
                        if (doc.data().channel_members.includes(userID)){
                            // console.log('yes!');
                            let postDate = doc.data().announcement_date.toDate();
                            // console.log(postDate);
                            let date = String(postDate.getDate());
                            let month = this.monthMap[postDate.getMonth()];
                            let year = String(postDate.getFullYear());
                            // if (count != 4){
                                tempChannels.push({...doc.data(), id: doc.id, annDate: `${date} ${month} ${year}` });
                                // count ++;
                            // }
                        }

                        // let postDate = doc.data().announcement_date.toDate();
                        // // console.log(postDate);
                        // let date = String(postDate.getDate());
                        // let month = this.monthMap[postDate.getMonth()];
                        // let year = String(postDate.getFullYear());
                        // if (count != 4){
                        //     tempAnnouncements.push({...doc.data(), id: doc.id, annDate: `${date} ${month} ${year}` });
                        //     count ++;
                        // }
                    })
                    this.channels = tempChannels; 
                    if(this.channels.length == 0){
                        // console.log("Channels is empty!");
                        this.channels=[];
                    }
                })
                .catch(err => {
                    console.log(err.message);
                })
            },
            getUser(){
                auth.onAuthStateChanged(async (user) => {
                    if (user === null) {
                        // logging out user
                        console.log(user);
                    } else {
                        this.userAuth = user;
                        // console.log('userAuth:', this.userAuth.uid);
                        this.getSchedule(this.userAuth.uid);
                        this.getMyForums(this.userAuth.uid);
                        this.getTimeFocused(this.userAuth.uid);
                    }
                })
            },
            getTimeFocused(userID){
                // console.log(this.userAuth);
                // collection ref
                const colRef = collection(db, 'focus')

                // queries
                const q = query(colRef, where("user_id", "==", userID))

                // real time collection
                getDocs(q)
                .then((snapshot) => {
                    var totalFocusSecs = 0;
                    snapshot.docs.forEach((doc) =>{
                        // console.log(doc.data().focus_duration);
                        console.log(doc.data().focus_start.seconds);
                        const d1 = new Date();
                        d1.setHours(0, 0, 0, 0);
                        var midnight1 = firebase.firestore.Timestamp.fromDate(d1).seconds;
                        

                        const d2 = new Date();
                        d2.setHours(23, 59, 59, 59);
                        var midnight2 = firebase.firestore.Timestamp.fromDate(d2).seconds;

                        if(doc.data().focus_start.seconds >= midnight1 && doc.data().focus_start.seconds <= midnight2){
                            totalFocusSecs += doc.data().focus_duration;
                        }
                    })

                    // console.log(totalFocusSecs);
                    

                    if(totalFocusSecs >= 60){
                        var totalFocusMins = Math.floor(totalFocusSecs/60);
                        if (totalFocusMins == 1){
                            this.timeFocused = `focus time: ${totalFocusMins} min!`
                        } else {
                            this.timeFocused = `focus time: ${totalFocusMins} mins!`
                        }
                    }
                })
                .catch(err => {
                    console.log(err.message);
                })               
            },
            // stopLoader(){
            //     this.loader = true;
            // }
        },
        created(){
            // setTimeout(this.stopLoader(), 5000);
            this.getUser();
            // this.startLoader();

            // this.getSchedule();
            // this.getMyForums();
            // this.getTodayDate();
            // this.getUserObj();
        },
        computed: {
            loader(){
                if(this.loader1 && this.loader2){
                    return true;
                }
            }
        }
    };
</script>
<style lang="css" scoped>
    .coursePageBtn {
        /* background-color: #CBD4CA; */
        /* color: #3C6563; */
        color: #CBD4CA;
    }
    .coursePageBtn:hover {
        background-color:#3C6563;
        color: #fbfafa;
    }

    .cardstyle {
        margin-top: 0px !important; 
    }

    .nolink:link {
        text-decoration: none;
        color: #3C6563;
    }

    .nolink:visited{
        color:#3C6563;
    }

    .nolink:hover{
        color: #CBD4CA;
    }

    .disabledLink:link {
        /* text-decoration: none; */
        color: #3C6563;
    }

    .disabledLink:visited{
        color:#3C6563;
    }

    .disabledLink:hover{
        color: #CBD4CA;
    }
    
    .about {
        background-color: #fbfafa;  
        /* min-height: 3000px; */
    }
    .scroll::-webkit-scrollbar {
        /* display: none; */
        width:0.5vw;
    }

    /* Track */
    .scroll::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
        border-radius: 10px;
    }
    
    /* Handle */
    .scroll::-webkit-scrollbar-thumb {
        background: #969C8B; 
        border-radius: 10px;
    }

    /* Handle on hover */
    .scroll::-webkit-scrollbar-thumb:hover {
        background: #3C6563; 
    }

    .subScroll::-webkit-scrollbar {
        /* display: none; */
        width:0.5vw;
    }

    /* Track */
    .subScroll::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
        border-radius: 10px;
    }
    
    /* Handle */
    .subScroll::-webkit-scrollbar-thumb {
        background: #969C8B; 
        border-radius: 10px;
    }

    /* Handle on hover */
    .subScroll::-webkit-scrollbar-thumb:hover {
        background: #3C6563; 
    }

    @media only screen and (min-device-width: 411px) and (max-device-width: 823px) {
        .scroll{    
            height: 32vh !important;
            margin-bottom:4.7em
        }
        .subScroll{
            height: 60vh !important;
            margin-bottom:4.7em
        }
    }
    /* .scroll::-webkit-scrollbar-thumb{
        background-color:#CBD4CA ;
    }
    .scroll::-webkit-scrollbar-track{
        background-color: white;
    } */

    /* html{
        scrollbar-width: none;
    } */
    </style>