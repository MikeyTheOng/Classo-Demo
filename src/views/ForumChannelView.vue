<template>
  <div class="forum-channel">
    <div class="container">
      <v-row class="d-flex flex-row justify-space-between my-2 flex-xs-column">
        <v-col>
          <div data-aos="fade-up" data-aos-delay="1000">
            <v-chip class="ms-2 mb-2" color="black" outlined style="font-weight: 500">
              PROF. {{ loadedChannelData[0].user.user_name.toUpperCase() }}
              <v-icon right> mdi-account-circle-outline </v-icon>
            </v-chip>
            <v-chip class="mb-2 ms-2" color="black" outlined style="font-weight: 500">
              {{ loadedChannelData[0].channel_title.toUpperCase() }}
              <v-icon right> mdi-information-outline </v-icon>
            </v-chip>
          </div>
        </v-col>

        <v-col>
          <div class="float-right">
            <div data-aos="fade-up" data-aos-delay="1000">
              <v-btn
                color="dark"
                class="mb-2 me-3"
                dark
                @click="unsubscribe()"
                v-if="loadedChannelData[0].channel_members.includes($store.state.user.uid)"
              >
                <v-icon left>mdi-check</v-icon> subscribed
              </v-btn>
              <v-btn
                color="dark"
                class="mb-2 me-3"
                dark
                @click="subscribe()"
                v-if="!loadedChannelData[0].channel_members.includes($store.state.user.uid)"
              >
                <v-icon left>mdi-bell</v-icon> subscribe
              </v-btn>

              <v-dialog v-model="dialog" hide-overlay transition="dialog-bottom-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="#698173" class="mb-2" dark v-bind="attrs" v-on="on">
                    <v-icon left>mdi-plus</v-icon>
                    Ask a Question
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar dark color="#3c6563">
                    <v-btn icon dark @click="dialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Ask a Question</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn
                        dark
                        text
                        @click="
                          dialog = false;
                          createPost();
                        "
                        >Submit</v-btn
                      >
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-content>
                    <div class="container">
                      <v-text-field v-model="postTitle" label="Post Title" required></v-text-field>
                      <v-text-field v-model="postDesc" label="Post Description" required></v-text-field>
                    </div>
                  </v-content>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </v-col>
      </v-row>

      <div data-aos="fade-up" data-aos-delay="1200">
        <v-card class="mt-1 pa-5 rounded-lg">
          <v-row>
            <v-col md="1">
              <div class="avatar"></div>
              <v-avatar color="#96968B" size="62">
                <span class="white--text text-h5">{{ loadedChannelData[0].user.user_name[0] }}</span>
              </v-avatar>
            </v-col>
            <v-col md="3">
              <div class="professor-name">Prof. {{ loadedChannelData[0].user.user_name }}</div>
              <div class="institution">SMU</div>
            </v-col>
            <v-col>
              <div class="announcement">
                Announcements <v-icon medium class="mb-1" color="red"> mdi-alert-circle </v-icon>
                <!-- <span
                v-if="
                  !containsNumber($store.state.user.email) &&
                  $store.state.user.email == loadedChannelData[0].user.user_email
                "
              > -->
                <span v-if="$store.state.user.email == loadedChannelData[0].user.user_email">
                  <v-dialog transition="dialog-top-transition" max-width="600">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on" color="#3c6563" style="color: #3c6563; font-weight: 600">
                        ( <v-icon color="#3c6563"> mdi-pencil </v-icon> EDIT)</span
                      >
                    </template>
                    <template v-slot:default="dialog">
                      <v-card>
                        <v-toolbar color="#3c6563" dark>Edit Announcement</v-toolbar>
                        <v-card-text>
                          <!-- <div class="text-h2 pa-12">Hello world!</div> -->
                          <v-textarea
                            clear-icon="mdi-close-circle"
                            label="New announcements"
                            :value="loadedChannelData[0].channel_announcement"
                            v-model="formEditedAnnouncement"
                          ></v-textarea>

                          <!-- <v-text-field
                          v-model="formEditAnnouncement"
                          :label="loadedChannelData[0].channel_announcement"
                          required
                        ></v-text-field> -->
                        </v-card-text>
                        <v-card-actions class="justify-end">
                          <v-btn
                            text
                            @click="
                              dialog.value = false;
                              editAnnouncement();
                            "
                            >Save changes</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </span>
              </div>
              <p>
                {{ loadedChannelData[0].channel_announcement }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <div data-aos="fade-up" data-aos-delay="1400">
        <div class="section-title">Most Recent</div>
      </div>
      <v-row>
        <v-col md="4" v-for="(data, index) in loadedPostData" :key="index">
          <div data-aos="fade-up" data-aos-delay="1600">
            <v-card class="pa-3 rounded-lg" :to="'/forum-post/' + data.id">
              <div class="d-flex flex-row justify-space-between">
                <div>
                  <!-- <v-avatar color="indigo" size="36">
                  <span class="white--text text-h5">J</span>
                </v-avatar> -->
                  <div>
                    <div class="name">{{ data.post_title }}</div>
                    <!-- <div class="date">3d</div> -->
                  </div>
                </div>
                <div>
                  <v-icon medium class="mb-1" color=""> mdi-arrow-right </v-icon>
                </div>
              </div>
              <hr class="my-2" />
              <div class="description text-truncate" style="font-weight: 400">
                {{ data.post_description }}
              </div>
              <div class="d-flex flex-row justify-space-between mt-3">
                <div class="comments">
                  <!-- <v-icon small class="mb-1" color=""> mdi-message </v-icon> {{ data.post_description }} -->
                  <!-- <span style="font-style: italic; color: #3c6563; font-weight: 500; text-transform: uppercase"
                  >By: {{ data.user.user_name }}</span
                > -->
                  <v-chip dark color="dark" style="font-weight: 500">
                    {{ data.user.user_name }}
                  </v-chip>

                  <v-chip
                    class="ma-2"
                    color="#3c6563"
                    text-color="white"
                    style="font-weight: 500"
                    v-if="data.post_completion_status"
                  >
                    <v-icon left> mdi-check </v-icon>
                    RESOLVED
                  </v-chip>
                  <v-chip class="ma-2" color="#962323" text-color="white" style="font-weight: 500" v-else>
                    <v-icon left> mdi-clock </v-icon>
                    UNRESOLVED
                  </v-chip>
                </div>
                <div class="votes">
                  <v-icon medium class="mb-1" color=""> mdi-arrow-up-bold </v-icon>{{ data.post_likes
                  }}<v-icon medium class="mb-1" color=""> mdi-arrow-down-bold </v-icon>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="!containsNumber($store.state.user.email)">
        <v-col>
          <div class="section-title">Post Analytics</div>
          <Bar :chart-data="chartData" />
        </v-col>
      </v-row>
      <!-- {{ tempChartDict }} -->
    </div>

    <loading-overlay imageName="snail_loader.gif" type="animated" :loaded="loaded"></loading-overlay>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

import { auth, db } from "../firebase/firebaseinit";
import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  collection,
  query,
  addDoc,
  deleteDoc,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export default {
  components: { Bar },
  watch: {
    loadedChannelData() {
      this.loaded = true;
    },
    loadedPostData() {
      this.loaded = true;
    },
  },
  data() {
    return {
      loaded: false,
      tempChartDict: {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      },
      chartData: {
        mainDict: {},
        labels: [], // x-axis ["January", "February", "March"]
        datasets: [
          {
            label: "Post Frequency",
            backgroundColor: "#f87979",
            data: [], // y-axis [40, 20, 12]
          },
        ],
      },
      dialog: false,
      channelId: null,
      postTitle: null,
      postDesc: null,
      loadedChannelData: [],
      loadedPostData: [],
      userAuth: null,
      getUser: null,
      newPost: null,
      formEditedAnnouncement: null,
    };
  },
  created() {
    auth.onAuthStateChanged(async (user) => {
      if (user === null) {
        // logging out user
        console.log(user);
      } else {
        this.userAuth = user;
      }
    });

    this.channelId = this.$route.params.channel_id;
    this.getChannels();
    this.getPosts();

    var user = auth.currentUser;
    console.log(user);
  },
  methods: {
    containsNumber(str) {
      return /\d/.test(str);
    },
    getChannels() {
      const channelRf = collection(db, "channel");

      const q = query(channelRf, where(firebase.firestore.FieldPath.documentId(), "==", this.channelId));

      onSnapshot(q, (querySnapshot) => {
        let channelArr = [];
        querySnapshot.forEach((doc) => {
          channelArr.push({ ...doc.data(), id: doc.id });
        });
        this.loadedChannelData = channelArr;
      });
    },
    getPosts() {
      const postRf = collection(db, "post");

      const q = query(postRf, where("channel.channel_id", "==", this.channelId));

      onSnapshot(q, (querySnapshot) => {
        let postsArr = [];
        querySnapshot.docs.forEach((doc) => {
          postsArr.push({ ...doc.data(), id: doc.id });

          // CHART.JS
          let extractedMonthName = { ...doc.data(), id: doc.id }.createdAt.toDate().toDateString().split(" ")[1];

          this.tempChartDict[extractedMonthName]++;
        });

        for (var month in this.tempChartDict) {
          console.log(this.tempChartDict);
          if (!this.chartData.labels.includes(month)) {
            this.chartData.labels.push(month);
            this.chartData.datasets[0].data.push(this.tempChartDict[month]);
          }
        }
        this.loadedPostData = postsArr;
      });
    },
    containsNumber(str) {
      return /\d/.test(str);
    },
    createPost() {
      if (this.postTitle === null || this.postDesc === null) {
        this.$swal.fire("Error", "Fields must not be empty!", "error");
        return;
      }

      console.log(this.userAuth, "CREATED");

      // get user collection
      const userRf = collection(db, "users");

      console.log(this.userAuth.uid);

      const q = query(userRf, where(firebase.firestore.FieldPath.documentId(), "==", this.userAuth.uid));

      getDocs(q)
        .then((snapshot) => {
          let userArr = [];
          snapshot.docs.forEach((doc) => {
            userArr.push({ ...doc.data(), id: doc.id });
          });

          console.log(userArr[0], "*******");

          let isProf = !this.containsNumber(userArr[0].user_email.split("@")[0]);
          console.log(isProf);

          const newPost = {
            channel: {
              channel_id: this.channelId,
              channel_role: isProf ? "owner" : "",
            },
            post_completion_status: false,
            post_description: this.postDesc,
            post_title: this.postTitle,
            post_likes: 0,
            user: {
              user_email: userArr[0].user_email,
              user_id: userArr[0].id,
              user_name: userArr[0].name,
            },
            createdAt: serverTimestamp(),
          };

          addDoc(collection(db, "post"), newPost);
          this.$swal.fire("Success ", "Post created successfully!", "success");

          console.log(newPost, "NEW POST");
        })
        .catch((err) => {
          console.log(err.message);
        });

      // console.log(newPost, "NEW POST");
      this.newPost = newPost;
    },
    editAnnouncement() {
      console.log("editAnnouncement");

      if (this.formEditedAnnouncement == "") {
        this.$swal.fire("Error", "Fields must not be empty!", "error");
        console.log("Cant update, cannot be empty");
        return;
      }

      const channelRf = doc(db, "channel", this.channelId);

      updateDoc(channelRf, {
        channel_announcement: this.formEditedAnnouncement,
      })
        .then((snapshot) => {
          console.log("snapshot: ", snapshot);
          this.$swal.fire("Success ", "Announcement updated successfully!", "success");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    subscribe() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "Receive notifications and announcements from this channel",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            // main logic

            const channelRf = doc(db, "channel", this.channelId);

            updateDoc(channelRf, {
              channel_members: arrayUnion(this.userAuth.uid),
            })
              .then((snapshot) => {
                console.log("snapshot: ", snapshot);
              })
              .catch((err) => {
                console.log(err);
              });

            // sweet alert
            this.$swal.fire(
              "Success!",
              "You have subscribed to this channel and will now receive announcements from this channel.",
              "success"
            );
          }
        });
    },
    unsubscribe() {
      console.log("UNSUBBED!");

      const channelRf = doc(db, "channel", this.channelId);

      updateDoc(channelRf, {
        channel_members: arrayRemove(this.userAuth.uid),
      })
        .then((snapshot) => {
          console.log("snapshot: ", snapshot);
        })
        .catch((err) => {
          console.log(err);
        });

      // sweet alert
      this.$swal.fire("Success!", "You have unsubscribed from this channel.", "success");
    },
  },
};
</script>

<style scoped>
.forum-channel {
  background-color: #f9f8f9;
  min-height: calc(100vh - 64px);
  height: 100%;
}

.professor-name {
  font-weight: 500;
  font-size: 1.2rem;
}

.institution {
  font-size: 1.2rem;
}

.announcement {
  font-weight: 500;
}

.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
  font-size: 1rem;
}

.name {
  font-weight: 500;
}
</style>
