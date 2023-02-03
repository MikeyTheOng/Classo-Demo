<template>
  <div class="forum-profile">
    <div class="container">
      <div data-aos="fade-up" data-aos-delay="500">
        <v-card class="mt-6 pa-5 rounded-lg">
          <v-row>
            <v-col md="1">
              <div class="avatar"></div>
              <v-avatar color="#96968B" size="62">
                <span class="white--text text-h5">M</span>
              </v-avatar>
            </v-col>
            <v-col md="3">
              <!-- <div class="professor-name">Prof. {{ loadedData[0].user.user_name }}</div>
            <div class="institution">SMU</div> -->
              <div class="professor-name">Prof. {{ loadedData[0].user.user_name }}</div>
              <div class="institution">SMU</div>
            </v-col>
            <v-col>
              <p v-if="loadedData[0].user.profile_description == ''">
                This user has no profile description yet.
                <span
                  v-if="
                    !containsNumber($store.state.user.email) && $store.state.user.email == loadedData[0].user.user_email
                  "
                >
                </span>
              </p>
              <div v-else>
                <div style="font-weight: 500">Profile Description:</div>
                {{ loadedData[0].user.profile_description }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <div data-aos="fade-up" data-aos-delay="1000">
        <div class="section-title">Prof. {{ loadedData[0].user.user_name }}'s Channels</div>
      </div>
      <div v-if="channels.length == 0">
        <div data-aos="fade-up" data-aos-delay="1000">
          <div class="no-channel-wrapper">
            <span>Looks like this professor has not created any channels yet.</span>
          </div>
        </div>
      </div>

      <div>
        <v-row>
          <v-col v-for="(data, index) in loadedData" :key="index" md="4" xs="12">
            <div data-aos="fade-up" data-aos-delay="1500">
              <v-card color="" class="card">
                <v-card-title class="text-h6"> {{ data.channel_title }} </v-card-title>

                <v-card-actions class="d-flex flex-row-reverse">
                  <!-- <v-card-subtitle>Total Members: {{ data.channel_members.length }}</v-card-subtitle> -->
                  <!-- <v-card-subtitle>Total Members: {{ data.channel_members.length }}</v-card-subtitle> -->

                  <router-link :to="'/forum-channel/' + data.id">
                    <v-btn depressed color="#3c6563" dark class="ma-3">View</v-btn>
                  </router-link>
                </v-card-actions>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../firebase/firebaseinit";
import { doc, setDoc, getDocs, collection, query, addDoc, deleteDoc, where, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      user_id: null,
      user_db: null,
      loadedData: null,
      channels: [
        {
          name: "Introduction to Programming",
          moduleCode: "IS-110",
        },
        {
          name: "Java Programming",
          moduleCode: "IS-208",
        },
      ],
    };
  },
  async created() {
    this.user_id = this.$route.params.user_id;
    this.user_db = await this.$store.state.user;

    this.getChannels();
  },
  methods: {
    containsNumber(str) {
      return /\d/.test(str);
    },
    getChannels() {
      const channelRf = collection(db, "channel");

      // queries
      // "4rj61Sw4ukgDrXO1kE6uJnmbHk02"
      const q = query(channelRf, where("user.user_id", "==", this.user_id));

      // real time collection data
      getDocs(q)
        .then((snapshot) => {
          let channelsJoined = [];
          snapshot.docs.forEach((doc) => {
            channelsJoined.push({ ...doc.data(), id: doc.id });
          });
          this.loadedData = channelsJoined;
          console.log(this.loadedData);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
};
</script>

<style scoped>
.forum-profile {
  background-color: #fbfafa;
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

.no-channel-wrapper {
  height: 25rem;
  width: 100%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}
</style>
