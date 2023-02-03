<template>
  <div class="forum-profile">
    <div data-aos="fade-up" data-aos-duration="1000">
      <!-- <router-link :to="'/forum-profile/' + data.user.user_id"> -->

      <router-link :to="'/forum-channel/' + data.id">
        <v-card class="mt-6 pa-5 rounded-lg card">
          <v-row>
            <v-col md="1">
              <router-link :to="'/forum-profile/' + data.user.user_id">
                <v-avatar color="#96968B" size="62" class="avatar">
                  <span class="white--text text-h5">{{ data.user.user_name[0] }}</span>
                </v-avatar>
              </router-link>
            </v-col>
            <v-col md="3">
              <div class="channel-name">{{ data.channel_title }}</div>
              <router-link :to="'/forum-profile/' + data.user.user_id">
                <div class="prof">Prof. {{ data.user.user_name }}</div>
              </router-link>
            </v-col>
            <v-col>
              <div class="channel-announcement">Announcement:</div>
              {{ data.channel_announcement }}</v-col
            >
          </v-row>
          <div class="channels">
            <div class="d-flex flex-row justify-end">
              <!-- <div v-for="(channel, index) in item.channels" :key="index">
                <v-chip class="ma-2" color=""> {{ channel }} </v-chip>
              </div> -->
            </div>
          </div>
        </v-card>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style scoped lang="css">
a {
  text-decoration: none;
}
.channel-name {
  font-weight: 600;
}

.channel-announcement {
  font-weight: 600;
}

.prof {
  font-style: italic;
  color: #3c6563;
  font-weight: 500;
}

.prof:hover {
  font-weight: 600;
}

.card:hover {
  box-shadow: 0 3px 6px rgba(60, 101, 99, 0.509), 0 3px 6px rgba(60, 101, 99, 0.513);
  transition: 0.3s ease-in-out;
  cursor: default;
}

.avatar:hover {
  background: #3c6563 !important;
  transition: 0.3s ease-in-out;
  cursor: pointer;
}
</style>
