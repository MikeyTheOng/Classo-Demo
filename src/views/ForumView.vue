<template>
  <div class="forum-search">
    <div class="container">
      <div class="header text-center">
        <div data-aos="fade-up" data-aos-duration="500">
          <!-- <div class="title">All Channels</div> -->
        </div>
        <div class="title">Search for your professor or channel name</div>

        <v-form ref="form" class="search-field">
          <v-text-field
            color="teal"
            rounded
            outlined
            label="Enter name of professor or channel name"
            v-model="searchedQuery"
          ></v-text-field>
        </v-form>
      </div>
      <div class="results">
        <div class="d-flex justify-space-between">
          <div data-aos="fade-up" data-aos-duration="1000">
            <div class="result-text">Results: {{ loadedDataLength }}</div>
          </div>
          <div>
            <!-- {{!containsNumber($store.state.user.email.split("@")[0])}} -->
            <v-dialog
              transition="dialog-bottom-transition"
              max-width="600"
              v-if="!containsNumber($store.state.user.email)"
            >
              <template v-slot:activator="{ on, attrs }">
                <div data-aos="fade-up" data-aos-duration="1000">
                  <v-btn color="#3c6563" dark v-bind="attrs" v-on="on">Create Channel</v-btn>
                </div>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="#3c6563" dark>Create a new channel</v-toolbar>
                  <v-card-text>
                    <v-text-field v-model="formChannelTitle" label="Channel Title" required></v-text-field>
                    <v-text-field
                      v-model="formChannelAnnouncement"
                      label="Channel Announcement"
                      required
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn
                      text
                      @click="
                        dialog.value = false;
                        createChannel();
                      "
                      >Create</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </div>

        <ForumProfile v-for="(data, index) in searchedResult" :key="index" :data="data"></ForumProfile>
        <!-- <div class="text-center my-5">
          <v-pagination v-model="page" :length="6" circle color="#3C6563"></v-pagination>
        </div> -->
      </div>
    </div>
    <loading-overlay imageName="snail_loader.gif" type="animated" :loaded="loaded"></loading-overlay>
  </div>
</template>

<script>
import { auth, db } from "../firebase/firebaseinit";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  addDoc,
  deleteDoc,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import ForumProfile from "../components/ForumListing.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

export default {
  components: {
    ForumProfile,
    LoadingOverlay,
  },
  watch: {
    loadedData() {
      this.loaded = true;
    },
  },
  data() {
    return {
      loaded: false,
      page: 1,
      loadedData: [],
      loadedDataLength: 0,
      userAuth: null,
      formChannelTitle: null,
      formChannelAnnouncement: null,
      searchedQuery: "",
    };
  },
  created() {
    this.getChannels();

    auth.onAuthStateChanged(async (user) => {
      if (user === null) {
        // logging out user
        console.log(user);
      } else {
        this.userAuth = user;
      }
    });
  },
  computed: {
    searchedResult() {
      return this.loadedData.filter((res) => {
        if (this.searchedQuery == "") {
          console.log("EMPTY");
          return res.channel_title;
        }
        return (
          res.user.user_name.toLowerCase().includes(this.searchedQuery.toLowerCase()) ||
          res.channel_title.toLowerCase().includes(this.searchedQuery.toLowerCase())
        );

        // return res.channel_title.toLowerCase().includes(this.searchedQuery.toLowerCase());
      });
    },
  },
  methods: {
    containsNumber(str) {
      return /\d/.test(str);
    },
    getChannels() {
      const channelRf = collection(db, "channel");

      onSnapshot(channelRf, (querySnapshot) => {
        let channelsJoined = [];
        querySnapshot.docs.forEach((doc) => {
          channelsJoined.push({ ...doc.data(), id: doc.id });
        });
        this.loadedData = channelsJoined;
        this.loadedDataLength = channelsJoined.length;
      });

      console.log(this.loadedData);
      // getDocs(channelRf)
      //   .then((snapshot) => {
      //     let channelsJoined = [];
      //     snapshot.docs.forEach((doc) => {
      //       channelsJoined.push({ ...doc.data(), id: doc.id });
      //     });
      //     this.loadedData = channelsJoined;
      //     this.loadedDataLength = channelsJoined.length;
      //     console.log(this.loadedData);
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    },
    createChannel() {
      if (this.formChannelTitle === null || this.formChannelAnnouncement === null) {
        this.$swal.fire("Error", "Fields must not be empty!", "error");
        console.log("FIELDS MUST NOT BE EMPTY");
        return;
      }

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

          const newChannel = {
            channel_announcement: this.formChannelAnnouncement,
            channel_members: [],
            channel_role: "owner",
            channel_title: this.formChannelTitle,
            announcement_date: serverTimestamp(),
            user: {
              profile_description: userArr[0].profile_description,
              user_email: userArr[0].user_email,
              user_id: userArr[0].id,
              user_name: userArr[0].name,
            },
          };
          console.log(newChannel);

          addDoc(collection(db, "channel"), newChannel);
          this.$swal.fire("Success ", "Channel created successfully!", "success");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
};
</script>

<style scoped>
.forum-search {
  background-color: #fbfafa;
  min-height: calc(100vh);
  height: 100%;
  margin-bottom: 10vh;
}
.title {
  font-size: 2rem !important;
  font-weight: 400;
  margin-top: 1rem;
}

.search-field {
  margin-top: 2rem;
}

.professor-name {
  font-weight: 500;
  font-size: 1.2rem;
}

.institution {
  font-size: 1.2rem;
}

.result-text {
  font-weight: 500;
}
</style>
