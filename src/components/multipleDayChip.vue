<template>
    <div>
        <v-chip small dark label outlined color="#C27D95" @click='displayAlert()'>Day {{ daysPassedSinceStart }} of {{ totalDays }}</v-chip>    
    </div>
    
</template>

<script>
export default {
    data(){
        return{
            totalDays : null,
            daysPassedSinceStart : null,
        }
    },
    props:['start','end'],
    methods:{
        displayAlert(){
            this.$swal.fire(`Day ${ this.daysPassedSinceStart } of ${ this.totalDays }`, "This event spans multiple days.", "info");
        }
    },
    computed:{

    },
    created(){
        // console.log(this.start.toDate());
        var startDate = this.start.toDate();
        startDate.setHours(0, 0, 0, 0);

        var endDate = this.end.toDate();
        endDate.setHours(0, 0, 0, 0);
        // console.log('astasd', startDate)

        var rawTotalDays = (endDate.getTime() - startDate.getTime()) / (1000*60*60*24);
        this.totalDays = rawTotalDays + 1;

        const d = new Date()
        // let d = new Date(2022,10,15);
        var rawDaysPassedSinceStart = Math.floor((d.getTime() - startDate.getTime()) / (1000*60*60*24));
        this.daysPassedSinceStart = rawDaysPassedSinceStart + 1;
    }
}

// import multipleDayChip from "./components/multipleDayChip.vue";
// components:{
//     multipleDayChip
// }
</script>

<style> 
    .v-chip:hover {
        /* background-color:#898FAA !important; */
        background-color: #C27D95;
    }
</style>