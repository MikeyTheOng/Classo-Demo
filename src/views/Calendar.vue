<style>
  @import '../assets/css/Calendar.css';
</style>

<template>
  <div align="center" justify="center" class="calendar-page">
    <v-container class="calendar-content">
      <v-row>
        <!-- Calendar component -->
        <v-col cols="11" md="8" class="calendar mx-md-0 fill-height">
          <v-row >
            <v-col :class="`elevation-6`">
              <v-sheet height="64">
                <v-toolbar
                  flat
                >
                  <v-btn
                    outlined
                    class="mr-4"
                    color="grey darken-2"
                    @click="setToday"
                  >
                    Today
                  </v-btn>
                  <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="prev"
                  >
                    <v-icon small>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="next"
                  >
                    <v-icon small>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-menu
                    bottom
                    right
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        outlined
                        color="grey darken-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>
                          mdi-menu-down
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-toolbar>
              </v-sheet>
              <v-sheet height="600">
                <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="#b8ccb6"
                  :events="events"
                  :event-color="getEventColor"
                  :type="type"
                  @click:event="showEvent"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="getEvents"
                ></v-calendar>

                <!-- Event details pop-up -->
                <v-menu
                  v-model="selectedOpen"
                  :close-on-content-click="false"
                  :activator="selectedElement"
                  offset-x
                >
                  <v-card
                    color="grey lighten-4"
                    flat
                    min-width="350px"
                    max-width="600px"
                  >
                    <v-toolbar
                      :color="selectedEvent.color"
                      dark
                      dense
                    >
                    <!-- Edit event -->
                      <v-toolbar-title class="event_popup_title" v-if="isEditing">  <!-- display only if in edit state -->
                        Edit Event
                      </v-toolbar-title>
                      <v-toolbar-title class="event_popup_title" v-else> <!-- display only if in view state -->
                        {{selectedEvent.name}}
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                        <v-btn icon v-if="!isEditing" @click="editEvent(selectedEvent)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon v-if="!isEditing" @click="deleteDialog = !deleteDialog">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>

                      <!--Confirm Delete Dialog-->
                      <v-dialog
                            v-model="deleteDialog"
                            persistent
                            dark
                            max-width="290"
                        >  
                            <v-card v-if="!deleting">
                                <v-card-title class="text-h5">
                                Delete Event
                                </v-card-title>
                                <v-card-text>Are you sure you want to delete this event?</v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="deleteDialog = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    color="red darken-1"
                                    text
                                    @click="deleteEvent()"
                                >
                                    Delete
                                </v-btn>
                                </v-card-actions>
                            </v-card>
                            <!--Deleting Loader-->
                            <v-card class="deleteLoad" v-else>
                                <v-progress-circular
                                    :size="100"
                                    color="white"
                                    indeterminate
                                ></v-progress-circular>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>

                    <!-- display only if in Edit state -->
                    <div v-if="isEditing">  
                      <v-card-text>
                        <v-form
                          ref="editEventForm"
                          v-model="editEventValid"
                          lazy-validation
                        >
                          <!-- Event Name -->
                          <v-text-field 
                            class="edit_field"
                            label="Event Name"
                            color="teal"
                            v-model="edited_event_name"
                            :rules="nameRules"
                            required
                          ></v-text-field>
                          
                          <!-- Start Date & Time -->
                          <v-row
                            justify="space-around"
                            no-gutters
                          >
                            <v-col cols="6">
                              <v-menu
                                ref="edited_start_menu"
                                v-model="edited_start_menu"
                                :close-on-content-click="true"
                                :return-value.sync="date"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="edited_start_date"
                                    label="Start Date"
                                    prepend-inner-icon="mdi-calendar"
                                    v-bind="attrs"
                                    v-on="on"
                                    dense
                                    class="pr-2"
                                    color="teal"
                                    required
                                    readonly
                                  ></v-text-field>
                                </template>
                                <v-date-picker 
                                  v-model="edited_start_date"
                                  
                                  no-title
                                  scrollable
                                >
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="6">
                              <v-select 
                                :disabled="edited_all_day_checkbox"
                                :items="start_time_items"
                                label="Start Time"
                                prepend-inner-icon="mdi-clock-outline"
                                dense
                                color="teal"
                                v-model="edited_start_time"
                                :rules="startTimeRules"
                                required
                              ></v-select>
                            </v-col>
                          </v-row>

                          <!-- End Date & Time -->
                          <v-row
                            justify="space-around"
                            no-gutters
                          >
                            <v-col cols="6">
                              <v-menu
                                ref="edited_end_menu"
                                v-model="edited_end_menu"
                                :close-on-content-click="true"
                                :return-value.sync="date"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    label="End Date"
                                    prepend-inner-icon="mdi-calendar"
                                    v-bind="attrs"
                                    v-on="on"
                                    dense
                                    v-model="edited_end_date"
                                    class="pr-2"
                                    color="teal"
                                    readonly
                                  ></v-text-field>
                                </template>
                                <v-date-picker 
                                  v-model="edited_end_date"
                                  no-title
                                  scrollable
                                  
                                >
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="6">
                              <v-select
                                :disabled="edited_all_day_checkbox"
                                :items="end_time_items"
                                label="End Time"
                                prepend-inner-icon="mdi-clock-outline"
                                dense
                                color="teal"
                                v-model="edited_end_time"
                                :rules="endTimeRules"
                                required
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-checkbox
                            v-model="edited_all_day_checkbox"
                            label="All day"
                            class="all_day_checkbox"
                            color="#3c6563"
                            :value="selectedEvent.all_day_checkbox"
                            @click="clear_time_edit()"
                          ></v-checkbox>
                          <v-text-field
                            v-model="edited_event_location"
                            label="Location"
                            prepend-inner-icon="mdi-map-marker"
                            dense
                            color="teal"
                          ></v-text-field>
                        
                          <v-textarea
                            v-model="edited_event_description"
                            name="input-7-1"
                            rows="2"
                            label="Description"
                            color="teal"
                            auto-grow
                          ></v-textarea>
                        </v-form>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          elevation="2"
                          color="#3c6563"
                          @click="cancel_editing()"
                          id="add_event_btn"
                          class="no-uppercase"
                          v-if="isEditing"
                          outlined
                        >
                          Cancel
                        </v-btn>

                        <v-btn
                          elevation="2"
                          color="#3c6563"
                          @click="update_event()"
                          id="add_event_btn"
                          class="no-uppercase"
                          v-if="isEditing"
                        >
                          Save
                        </v-btn>
                        <!-- <v-snackbar
                          v-model="edit_event_snackbar"
                          :timeout="edit_event_timeout"
                          rounded="pill"
                          color="success"
                          left
                        >
                          {{ edit_event_snackbar_text }}
                        </v-snackbar> -->
                        <v-snackbar
                          v-model="edit_event_error_snackbar"
                          :timeout="edit_event_timeout"
                          rounded="pill"
                          color="red accent-2"
                          left
                      
                        >
                          {{ edit_event_error_snackbar_text }}
                        </v-snackbar>
                      </v-card-actions>
                      
                    </div>

                    <!-- display only if in View state -->
                    <v-card-text v-else>  
                      <h3 class="eventDetails">
                        <v-icon>mdi-calendar</v-icon>
                        &nbsp;Start:&nbsp;&nbsp;<span class="eventDetailsContent">{{this.edited_start_date}}&nbsp;&nbsp;&nbsp;{{this.edited_start_time}}</span>
                      </h3>
                        
                      <h3 class="eventDetails">
                        <v-icon>mdi-calendar</v-icon>
                        &nbsp;End:&nbsp;&nbsp;<span class="eventDetailsContent">{{this.edited_end_date}}&nbsp;&nbsp;&nbsp;{{this.edited_end_time}}</span></h3>
                      <h3 v-if="selectedEvent.all_day_checkbox" class="eventDetails">All Day</h3>
                      <br/>
                      <h3 class="eventDetails">
                        <v-icon>mdi-map-marker</v-icon>
                        &nbsp;Location:&nbsp;&nbsp;<span class="eventDetailsContent">{{selectedEvent.location}}</span>
                      </h3>
                      <h3 class="eventDetails">
                        <v-icon>mdi-text</v-icon>
                        &nbsp;Description:&nbsp;&nbsp;<span class="eventDetailsContent">{{selectedEvent.description}}</span>
                      </h3>
                    </v-card-text>
                  </v-card>
                  
                </v-menu>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>

        <!-- Sidebar component -->
        <v-col cols="12" md="4" class="sidebar pt-6 px-7 pt-md-0">
          <!-- Event component -->
          <v-row no-gutters>
            <v-col>
              <v-card
                elevation="2"
                outlined
                class="pa-3"
              >
                <v-card-title>
                  <h3>New Event</h3> 
                </v-card-title>
                <v-card-text class="card-text">
                  <v-form
                    ref="addEventForm"
                    v-model="addEventValid"
                    lazy-validation
                  >
                    <v-text-field
                      v-model="new_event_name"
                      label="Event Name"
                      outlined
                      dense
                      color="teal"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                    <!-- Start Date & Time -->
                    <v-row
                      justify="space-around"
                      no-gutters
                    >
                      <v-col cols="6">
                        <v-menu
                          ref="start_menu"
                          v-model="start_menu"
                          :close-on-content-click="true"
                          :return-value.sync="date"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="start_date"
                              label="Start Date"
                              prepend-inner-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              dense
                              outlined
                              class="pr-2 datetime_input_field"
                              color="teal"
                              required
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="start_date"
                            
                            no-title
                            scrollable
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="6">
                        <v-select 
                          :disabled="all_day_checkbox"
                          :items="start_time_items"
                          v-model="start_time"
                          label="Start Time"
                          prepend-inner-icon="mdi-clock-outline"
                          dense
                          outlined
                          color="teal"
                          class="datetime_input_field"
                          :rules="startTimeRules"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>

                    <!-- End Date & Time -->
                    <v-row
                      justify="space-around"
                      no-gutters
                    >
                      <v-col cols="6">
                        <v-menu
                          ref="end_menu"
                          v-model="end_menu"
                          :close-on-content-click="true"
                          :return-value.sync="date"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="end_date"
                              label="End Date"
                              prepend-inner-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              dense
                              outlined
                              class="pr-2 datetime_input_field"
                              color="teal"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="end_date"
                            no-title
                            scrollable
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          :disabled="all_day_checkbox"
                          :items="end_time_items"
                          v-model="end_time"
                          label="End Time"
                          prepend-inner-icon="mdi-clock-outline"
                          dense
                          outlined
                          color="teal"
                          class="datetime_input_field"
                          :rules="endTimeRules"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-checkbox
                      v-model="all_day_checkbox"
                      label="All day"
                      class="all_day_checkbox"
                      color="#3c6563"
                      @click="clear_time()"
                    ></v-checkbox>
                    <v-text-field
                      v-model="new_event_location"
                      label="Location"
                      prepend-inner-icon="mdi-map-marker"
                      outlined
                      dense
                      color="teal"
                    ></v-text-field>
                    
                    <v-textarea
                      v-model="new_event_description"
                      name="input-7-1"
                      outlined
                      label="Description"
                      auto-grow
                      color="teal"
                    ></v-textarea>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    outlined
                    elevation="2"
                    color="#3c6563"
                    id="clear_event_btn"
                    @click="clear_new_event()"
                    class="no-uppercase"
                  >
                    Clear
                  </v-btn>
                  <v-btn
                    elevation="2"
                    color="#3c6563"
                    @click="add_new_event()"
                    id="add_event_btn"
                    class="no-uppercase"
                  >
                    Add
                  </v-btn>
                  <v-snackbar
                    v-model="add_event_snackbar"
                    :timeout="add_event_timeout"
                    rounded="pill"
                    color="success"
                    right
                  >
                    {{ add_event_snackbar_text }}
                  </v-snackbar>
                  <v-snackbar
                    v-model="add_event_error_snackbar"
                    rounded="pill"
                    color="red accent-2"
                    right
                  >
                    {{ add_event_error_snackbar_text }}
                  </v-snackbar>
                </v-card-actions>
              </v-card>

            </v-col>
          </v-row> <!-- End of Event component -->

        </v-col> <!-- End of Sidebar component -->
      </v-row>
    </v-container>
    <loading-overlay type="animated" imageName="snail_loader.gif" :loaded="loaded"></loading-overlay>
  </div>

</template>

    <!-- Calendar script -->
    <script src="../assets/js/Calendar.js"></script>