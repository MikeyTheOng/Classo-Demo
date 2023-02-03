<template>
  <div class="forum-post">
    <div class="container">
      <div class="d-flex justify-space-between mt-5">
        <!-- <div v-if="!loadedPost[0].post_completion_status">
          <v-chip class="mb-5" close color="#962323" text-color="" outlined> UNRESOLVED </v-chip>
        </div> -->
        <v-chip
          class="ma-2"
          color="#962323"
          text-color="white"
          style="font-weight: 500"
          v-if="!loadedPost[0].post_completion_status"
        >
          <v-icon left> mdi-clock </v-icon>
          UNRESOLVED
        </v-chip>
        <v-chip class="mb-5" color="#3c6563" text-color="white" style="font-weight: 600" v-else>
          <v-icon left> mdi-check </v-icon>
          RESOLVED
        </v-chip>
        <button
          class="remove-post"
          v-if="loadedPost[0].user.user_email == $store.state.user.email"
          @click="removePost()"
        >
          <v-icon left style="color: red"> mdi-trash-can-outline </v-icon>
          Remove Post
        </button>
      </div>
      <div class="author-question-wrapper">
        <v-card class="pa-5 rounded-lg">
          <v-row>
            <v-col md="1">
              <div class="votes text-center">
                <v-icon medium class="mb-1" color="" @click="upvote()"> mdi-arrow-up-bold </v-icon><br />
                {{ loadedPost[0].post_likes }}<br />
                <v-icon medium class="mt-1" color="" @click="downvote()"> mdi-arrow-down-bold </v-icon>
              </div>
            </v-col>
            <v-col>
              <v-row class="d-flex flex-row justify-space-between">
                <v-col class="author">
                  {{ loadedPost[0].user.user_name }} |
                  <span v-if="loadedPost[0].createdAt">{{ loadedPost[0].createdAt.toDate().toDateString() }}</span>
                </v-col>
                <v-col class="comment">
                  <div class="float-right">
                    <span v-if="loadedPost[0].user.user_email == $store.state.user.email">
                      <v-btn
                        color="#962323"
                        dark
                        class="me-2"
                        @click="resolvePost()"
                        v-if="!loadedPost[0].post_completion_status"
                        >Mark as resolved</v-btn
                      >
                    </span>
                    <v-btn color="#962323" class="me-2" disabled v-else>mark as resolved</v-btn>
                    <v-dialog transition="dialog-bottom-transition" max-width="600">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn color="#3c6563" dark v-bind="attrs" v-on="on">Comment</v-btn>
                      </template>
                      <template v-slot:default="dialog">
                        <v-card>
                          <v-toolbar color="#3c6563" dark>Comment on this post</v-toolbar>
                          <v-card-text>
                            <v-text-field v-model="formComment" label="Write a comment" required></v-text-field>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn
                              text
                              @click="
                                dialog.value = false;
                                createComments();
                              "
                              >Submit</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </div>
                </v-col>
              </v-row>

              <div class="question-title">{{ loadedPost[0].post_title }}</div>
              <!-- 
              <div class="chips my-1">
                <v-chip class="mb-2" color="#96968B" dark>
                  <v-icon left> mdi-label </v-icon>
                  Introduction to Programming
                </v-chip>
                <v-chip class="ms-2 mb-2" color="#96968B" dark>
                  <v-icon left> mdi-label </v-icon>
                  IS-110
                </v-chip>
              </div> -->

              <div class="question-desc">
                {{ loadedPost[0].post_description }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <div class="wrapper mt-5" v-for="(comment, index) in loadedComments" :key="index">
        <v-card class="pa-5 rounded-lg">
          <v-row>
            <v-col md="1">
              <div class="votes text-center">
                <v-icon medium class="mb-1" color=""> mdi-arrow-up-bold </v-icon><br />
                {{ comment.comment_votes }}<br />
                <v-icon medium class="mt-1" color=""> mdi-arrow-down-bold </v-icon>
              </div>
            </v-col>
            <v-col>
              <div class="d-flex flex-row justify-space-between">
                <div class="author">
                  {{ comment.user.user_name }} | {{ comment.createdAt.toDate().toDateString() }}
                  <v-chip class="ms-2 mb-2" color="#FFA500" dark v-if="comment.channel.channel_role === 'TA'" outlined>
                    <v-icon left> mdi-check </v-icon>
                    TA
                  </v-chip>
                </div>
              </div>

              <div class="question-desc">
                {{ comment.comment_desc }}
              </div>
              <br />
              <div class="d-flex justify-end" v-if="comment.user.user_email == $store.state.user.email">
                <button class="remove-post mt-1" @click="removeComment(comment.id)" style="font-size: 0.8rem">
                  Remove comment
                </button>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
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
  updateDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export default {
  data() {
    return {
      postId: null,
      loadedPost: [],
      loadedComments: [],
      formComment: null,
      userAuth: null,
      userObj: null,
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

    this.postId = this.$route.params.post_id;
    this.getPost();
    this.getComments();
  },
  methods: {
    containsNumber(str) {
      return /\d/.test(str);
    },
    getPost() {
      const channelRf = collection(db, "post");

      const q = query(channelRf, where(firebase.firestore.FieldPath.documentId(), "==", this.postId));

      onSnapshot(q, (querySnapshot) => {
        let postArr = [];
        querySnapshot.docs.forEach((doc) => {
          postArr.push({ ...doc.data(), id: doc.id });
        });
        this.loadedPost = postArr;
        console.log(this.loadedPost);
      });
    },
    getComments() {
      const commentRf = collection(db, "comment");

      const q = query(commentRf, where("post.post_id", "==", this.postId));

      onSnapshot(q, (querySnapshot) => {
        let commentArr = [];
        querySnapshot.docs.forEach((doc) => {
          commentArr.push({ ...doc.data(), id: doc.id });
        });
        this.loadedComments = commentArr;
      });
    },
    createComments() {
      if (this.formComment === null) {
        this.$swal.fire("Error", "Fields must not be empty!", "error");
        return;
      }

      // get post collection
      const postRf = collection(db, "post");

      console.log(this.userAuth.uid);

      const q = query(postRf, where(firebase.firestore.FieldPath.documentId(), "==", this.postId));

      getDocs(q)
        .then((snapshot) => {
          let postArr = [];
          snapshot.docs.forEach((doc) => {
            postArr.push({ ...doc.data(), id: doc.id });
          });

          console.log("postArr: ", postArr);

          // GET USER DETAILS
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

              // get the post ID
              // get current user details
              // insert into post
              const newComment = {
                channel: {
                  channel_id: postArr[0].channel.channel_id,
                  channel_role: postArr[0].channel.channel_role,
                },
                comment_desc: this.formComment,
                comment_votes: 0,
                post: {
                  post_id: this.postId,
                },
                user: {
                  user_id: userArr[0].id,
                  user_name: userArr[0].name,
                  user_email: userArr[0].user_email,
                },
                createdAt: serverTimestamp(),
              };

              console.log("NEW COMMENT: ", newComment);
              addDoc(collection(db, "comment"), newComment);

              this.$swal.fire("Success ", "Comment created successfully!", "success");
            })
            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((err) => {
          console.log(err.message);
        });

      this.getComments();
    },
    upvote() {
      console.log("UPVOTE!");

      const postRf = doc(db, "post", this.postId);

      updateDoc(postRf, {
        post_likes: this.loadedPost[0].post_likes + 1,
      })
        .then((snapshot) => {
          console.log("snapshot: ", snapshot);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downvote() {
      console.log("DOWNVOTE!");

      const postRf = doc(db, "post", this.postId);

      updateDoc(postRf, {
        post_likes: this.loadedPost[0].post_likes - 1,
      })
        .then((snapshot) => {
          console.log("snapshot: ", snapshot);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removePost() {
      console.log("POST REMOVED!");
      const channelRf = collection(db, "post");

      deleteDoc(doc(channelRf, this.postId));
      this.$swal.fire("Success ", "Post deleted successfully.", "success");
      history.back();
    },
    removeComment(commentId) {
      console.log("COMMENT REMOVED!");

      const commentRf = collection(db, "comment");

      deleteDoc(doc(commentRf, commentId));
      this.$swal.fire("Success ", "Comment deleted successfully.", "success");
      // history.back();
    },

    resolvePost() {
      console.log("RESOLVED!");

      const channelRf = doc(db, "post", this.postId);

      updateDoc(channelRf, {
        post_completion_status: true,
      })
        .then((snapshot) => {
          console.log("snapshot: ", snapshot);
          this.$swal.fire("Success ", "Post has been resolved successfully!", "success");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.forum-post {
  background-color: #fbfafa;
  min-height: calc(100vh - 64px);
  height: 100%;
}

.author-question-wrapper {
  border: 10px solid #3c656355;
  border-radius: 10px;
}

.author {
  color: #3c6563;
  font-weight: 500;
}

.question-title {
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0rem;
}

.comment {
  color: #3c6563;
  font-weight: 500;
  text-transform: uppercase;
}

.remove-post {
  color: red;
  font-weight: 500;
  margin-bottom: 10px;
  text-transform: uppercase;
}
</style>
