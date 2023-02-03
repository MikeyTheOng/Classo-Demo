<template>
    <div class="focus-bg">
        <v-row>

            <!--Header-->
            <v-col>
                <div class="header text-sm-h3">
                    {{ userName }}'s Focus Page
                </div>
            </v-col>
        </v-row>
        <v-row align="center" style="height: 80vh" class="pt-7 pt-sm-0">
            <v-col class="mx-10">
                <div class="card-glass">

                    <!--Pomodoro-->
                    <div class="card-title">
                        Pomodoro Timer
                    </div>
                    <v-row>
                        <v-col cols="6">
                            <div class="garden">
                                <img class="tree" :src="growth"/>
                            </div>
                        </v-col>
                        <v-col align-self="center">
                            <div class="timer">
                                {{min}}:{{sec}}
                            </div>
                            <div class="text-center mb-1">
                                <v-btn-toggle v-if="!active" dark>
                                    <v-btn v-on:click="seconds()"><v-icon>mdi-play</v-icon></v-btn>
                                    <v-btn disabled><v-icon>mdi-stop</v-icon></v-btn>
                                </v-btn-toggle>
                                <v-btn-toggle v-model="toggle_none" v-else dark>
                                    <v-btn v-on:click="pause" v-if="!paused"><v-icon>mdi-pause</v-icon></v-btn>
                                    <v-btn v-on:click="seconds()" v-else><v-icon>mdi-pause</v-icon></v-btn>
                                    <v-btn v-on:click="end"><v-icon>mdi-stop</v-icon></v-btn>
                                </v-btn-toggle>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-col>

            <!--Spacing-->
            <v-col cols="0" sm="5" md="7" lg="8"></v-col>
        </v-row>

        <!--Scrim-->
        <div class="fog d-flex d-sm-none" v-if="spotify || notebook"></div>

        <!--Spotify & Notebook-->
        <div>
            <!--Side Buttons-->
            <v-btn-toggle v-model="toggle_none2" class="menu d-none d-sm-flex" dark>
                <v-btn class="corners-1" @click.stop="spotify = !spotify">
                    <v-icon>mdi-spotify</v-icon>
                </v-btn>
                <v-btn class="corners-2" @click.stop="notebook = !notebook">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-btn-toggle>

            <!--Side Buttons XS-->
            <v-btn-toggle v-model="toggle_none2" class="menu-xs d-flex d-sm-none" dark>
                <v-btn @click.stop="spotify = !spotify">
                    <v-icon>mdi-spotify</v-icon>
                </v-btn>
                <v-btn @click.stop="notebook = !notebook">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-btn-toggle>

            <!--Spotify-->
            <v-navigation-drawer
                v-model="spotify"
                absolute
                temporary
                right
                hide-overlay
                :width="panelWidth"
                height="450px"
                class="panel"
                :style="{'right': panelRight}"
            >
                <div class="card-title mb-2 ml-5">
                    Spotify
                </div>
                    
                <div class="mx-5">

                    <!--Connect to Spotify-->
                    <div class="card-dark" v-if="!connected">
                        <v-row style="height: 20%;">
                            <v-col>
                                <p class="text-center"><v-icon large color="#1DB954">mdi-spotify</v-icon> Spotify</p>
                            </v-col>
                        </v-row>
                        <v-row align="center" style="height: 75%;">
                            <v-col class="text-center">
                                <h3>Millions of songs.<br/>Free on Spotify.</h3>
                                <br/>
                                <v-btn
                                    rounded
                                    color="#1DB954"
                                    dark
                                    width="80%"
                                    @click="authorize()"
                                >
                                    Connect
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>

                    <!--Connected to Spotify-->
                    <div v-else>

                        <!--Searched and selected a result to play-->
                        <div v-if="selectedSearch">
                            <div class="card-dark-3 pa-5" v-if="selectedType != 'track'">
                                <div class="float-left pb-3"><v-icon color="white" @click="backSpotify(3)">mdi-chevron-left</v-icon> Back</div>
                                <iframe style="border-radius: 0 0 12px 12px" :src="embed" width="100%" height="300" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                            </div>
                            <div class="card-dark-2" v-else>
                                <iframe style="border-radius:12px; transform: scaleY(1.05); padding-top: 9px;" :src="embed" width="100%" height="97.5%" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                <div class="close pa-1"><v-icon style="cursor: pointer;" color="white" @click="backSpotify(3)">mdi-chevron-left</v-icon> Back</div>
                            </div>
                        </div>

                        <!--Spotify Landing Page-->
                        <div class="card-dark pt-0" v-else-if="!selectedGenre">
                            <v-row class="black" style="position: sticky; top: 0px;">
                                <v-col cols="12" class="pb-0">
                                    <h4>
                                        Search
                                        <v-btn
                                            x-small
                                            dark
                                            class="float-right rounded-pill px-2"
                                            @click="logOut()"
                                        >
                                            Log out
                                        </v-btn>
                                    </h4>
                                </v-col>
                                <v-col cols="12" class="pb-0" style="position: relative;">
                                    <v-text-field
                                        solo
                                        dense
                                        color="black"
                                        label="Listen to..."
                                        prepend-inner-icon="mdi-magnify"
                                        hide-details
                                        class="rounded-pill"
                                        v-model="searchInput"
                                        @input="searchSpotify()"
                                    >
                                    </v-text-field>
                                    <v-icon color="black" class="input-x" @click="clearInput()">mdi-close</v-icon>
                                </v-col>
                                <v-col>
                                    <v-btn-toggle v-if="showBtn" group mandatory v-model="toggle_type" @change="searchSpotify()">
                                        <v-btn
                                            x-small
                                            dark
                                            class="rounded-pill px-2"
                                        >
                                            Artists
                                        </v-btn>
                                        <v-btn
                                            x-small
                                            dark
                                            class="rounded-pill px-2"
                                        >
                                            Songs
                                        </v-btn>
                                        <v-btn
                                            x-small
                                            dark
                                            class="rounded-pill px-2"
                                        >
                                            Albums
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-col>
                            </v-row>

                            <!--Browse Genres-->
                            <div v-if="!searchActive">
                                <v-row>
                                    <v-col class="py-5">
                                        <h4>Browse Genres</h4>
                                    </v-col>
                                </v-row>
                                <v-row justify="space-around">
                                    <v-col @click="getPlaylistByGenre(genre)" cols="5" class="genre" style="aspect-ratio: 1/1;" v-for="genre in genres" :key="genre.id" :style="{'background-image': `url(${genre.icons[0].url})`}"><span class="black">{{genre.name}}</span></v-col>
                                    <v-col v-if="genres && genres.length % 2 != 0" cols="5" class="genre"></v-col>
                                </v-row>
                            </div>

                            <!--Searching-->
                            <div v-else-if="searchReady && !noResults">
                                <v-row>
                                    <v-col class="pt-5">
                                        <h4>Top Results</h4>
                                    </v-col>
                                </v-row>
                                <v-row v-if="type == 'artist'" justify="space-around">
                                    <v-col v-for="(item, idx) in searchItems" :key="item.id" cols="6" class="ma-0 pb-6 pt-0">
                                        <v-col @click="embedPlayer(item.type, item.id)" cols="12" class="genre ma-0" style="aspect-ratio: 1/1;" :style="{'background-image': `url(${item.images[0].url})`}"></v-col>
                                        <v-col class="ma-0 pb-0 px-0 item-name" cols="12">{{item.name}}</v-col>
                                    </v-col>
                                    <v-col v-if="searchItems && searchItems.length % 2 != 0" cols="6" class="ma-0 pb-6 pt-0">
                                        <v-col class="genres ma-0" cols="12" style="aspect-ratio: 1/1;"></v-col>
                                    </v-col>
                                </v-row>
                                <v-row v-else-if="type == 'track'" justify="space-around">
                                    <v-col v-for="item in searchItems" :key="item.id" cols="6" class="ma-0 pb-6 pt-0">
                                        <v-col @click="embedPlayer(item.type, item.id)" cols="12" class="genre ma-0" style="aspect-ratio: 1/1;" :style="{'background-image': `url(${item.album.images[0].url})`}"></v-col>
                                        <v-col class="ma-0 pb-0 px-0 item-name" cols="12">
                                            {{item.name}}<br/>
                                            <span style="color: darkgray;" v-for="(artist, idx) in item.artists">
                                                <span v-if="idx==item.artists.length-1">
                                                    {{artist.name}}
                                                </span>
                                                <span v-else>
                                                    {{artist.name}}, 
                                                </span>
                                            </span>
                                        </v-col>
                                    </v-col>
                                    <v-col v-if="searchItems && searchItems.length % 2 != 0" cols="6" class="ma-0 pb-6 pt-0">
                                        <v-col class="genres ma-0" cols="12" style="aspect-ratio: 1/1;"></v-col>
                                    </v-col>
                                </v-row>
                                <v-row v-else-if="type == 'album'" justify="space-around">
                                    <v-col v-for="item in searchItems" :key="item.id" cols="6" class="ma-0 pb-6 pt-0">
                                        <v-col @click="embedPlayer(item.type, item.id)" cols="12" class="genre ma-0" style="aspect-ratio: 1/1;" :style="{'background-image': `url(${item.images[0].url})`}"></v-col>
                                        <v-col class="ma-0 pb-0 px-0 item-name" cols="12">
                                            {{item.name}}<br/>
                                            <span style="color: darkgray;" v-for="(artist, idx) in item.artists">
                                                <span v-if="idx==item.artists.length-1">
                                                    {{artist.name}}
                                                </span>
                                                <span v-else>
                                                    {{artist.name}}, 
                                                </span>
                                            </span>
                                        </v-col>
                                    </v-col>
                                    <v-col v-if="searchItems && searchItems.length % 2 != 0" cols="6" class="ma-0 pb-6 pt-0">
                                        <v-col class="genres ma-0" cols="12" style="aspect-ratio: 1/1;"></v-col>
                                    </v-col>
                                </v-row>
                            </div>
                            <v-row class="ma-0" style="height: 250px;" v-else-if="!searchReady">
                                <v-col align="center" align-self="center">
                                    <v-progress-circular
                                        :size="100"
                                        color="white"
                                        indeterminate
                                    ></v-progress-circular>
                                </v-col>
                            </v-row>
                            <v-row v-else-if="noResults">
                                <v-col>
                                    <h4>No Results Found.</h4>
                                </v-col>
                            </v-row>
                        </div>

                        <!--Selected a Genre-->
                        <div v-else>

                            <!--Display Genre Playlists-->
                            <div class="card-dark pt-0" v-if="!selectedPlaylist">
                                <v-row class="black" style="position: sticky; top: 0px;">
                                    <v-col class="py-5">
                                        <h4><v-icon color="white" @click="backSpotify(1)">mdi-chevron-left</v-icon> {{genreName}}</h4>
                                    </v-col>
                                </v-row>
                                <v-row justify="space-around">
                                    <v-col cols="12" style="aspect-ratio: 1/1;" v-for="playlist in playlists" :key="playlist.id">
                                        <v-col @click="embedPlaylist(playlist.id)" cols="12" class="genre" style="aspect-ratio: 1/1;" :style="{'background-image': `url(${playlist.images[0].url})`}"></v-col>
                                        <p class="font-weight-bold">{{playlist.name}}
                                        <br/>
                                            <span class="caption">{{playlist.description}}</span>
                                        </p>
                                    </v-col>
                                </v-row>
                            </div>

                            <!--Playlist-->
                            <div class="card-dark-3 pa-5" v-else>
                                <div class="float-left pb-3"><v-icon color="white" @click="backSpotify(2)">mdi-chevron-left</v-icon> Back</div>
                                <iframe style="border-radius: 0 0 12px 12px" :src="embed" width="100%" height="300" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </v-navigation-drawer>

            <!--Notebook-->
            <v-navigation-drawer
                v-model="notebook"
                absolute
                temporary
                right
                hide-overlay
                :width="panelWidth"
                height="450px"
                class="panel pb-0"
                :style="{'right': panelRight}"
            >
                <div class="notebook">
                    <div class="card-title mb-2 mx-5">
                        Notebook

                        <!--Add and Delete Note Buttons-->
                        <span class="float-right">
                            <v-btn elevation="2" v-on:click="addOpen" fab dark x-small v-if="!newEntry && !opened">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </span>
                        <span class="float-right">
                            <v-btn v-on:click="dialog = !dialog" elevation="2" fab dark x-small v-if="opened">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </span>

                        <!--Confirm Delete Dialog-->
                        <v-dialog
                            v-model="dialog"
                            persistent
                            dark
                            max-width="290"
                        >  
                            <v-card v-if="!deleting">
                                <v-card-title class="text-h5">
                                Delete Note
                                </v-card-title>
                                <v-card-text>Are you sure you want to delete this note?</v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="dialog = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    color="red darken-1"
                                    text
                                    @click="del"
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
                    </div>


                    <div>
                        <!--View existing entries-->
                        <div v-if="!opened && !newEntry && notes.length != 0">
                            <div>
                                <div v-if="page==pages">
                                    <div v-for="idx in lastPage">
                                        <div class="note" @click="view(idx-1+nextPage)">{{ notes[idx-1+nextPage].note_title }}</div>
                                    </div>
                                </div>
                                <div v-else v-for="idx in 6"> 
                                    <div class="note" @click="view(idx-1+nextPage)">{{ notes[idx-1+nextPage].note_title }}</div>
                                </div>
                            </div>
                            <br/>
                            <div class="pagination">
                                <div class="text-center">
                                <v-pagination
                                    v-model="page"
                                    :length="pages"
                                    :total-visible="0"
                                    prev-icon="mdi-menu-left"
                                    next-icon="mdi-menu-right"
                                    dark
                                ></v-pagination>
                                </div>
                            </div>
                        </div>
                        <!--View/edit existing entry-->
                        <div v-if="opened && !newEntry">
                            <div class="view-pen">
                                <input type="text" class="input-title" v-model="openedTitle" placeholder="Title" autofocus/>
                                <br/>
                                <textarea class="input-body" v-model="openedContent" placeholder="Type something..."/>
                            </div>
                            <div class="text-center">
                                <v-btn elevation="2" v-on:click="close" class="mr-5" dark>Close</v-btn>
                                <v-btn elevation="2" v-on:click="save" dark :disabled="saveGray">Save</v-btn>
                            </div>
                        </div>
                        <!--Add new entry-->
                        <div v-if="newEntry">
                            <div class="view-pen">
                                <input type="text" class="input-title" v-model="newTitle" placeholder="Title" autofocus/>
                                <br/>
                                <textarea class="input-body" v-model="newContent" placeholder="Type something..."/>
                            </div>
                            <div class="text-center">
                                <v-btn elevation="2" v-on:click="close" class="mr-5" dark>Close</v-btn>
                                <v-btn elevation="2" v-on:click="add" dark :disabled="addSaveGray">Save</v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </v-navigation-drawer>
        </div>
        
        <!--Alert-->
        <div class="text-center ma-2">
            <v-snackbar
                v-model="snackbar"
                top
            >
                {{ alert }}
                <template v-slot:action="{ attrs }">
                    <v-btn
                        color="pink"
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                    >
                        Close
                    </v-btn>
                </template>
            </v-snackbar>
        </div>

        <!--Initial Loading Page-->
        <v-row :class="{'initial-load': true, fadeOut: initLoad, 'ma-0': true}" justify="center">
            <v-col align="center" align-self="center" class="init-loading-text">Building your Focus Page...
                <v-progress-circular
                    :size="100"
                    color="white"
                    indeterminate
                ></v-progress-circular>
            </v-col>
        </v-row>
    </div>
</template>
<script>
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import { auth, db } from "../firebase/firebaseinit";
    import { getFirestore, doc, collection, query, where, onSnapshot, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";

    export default {
        created() {
            if ((new URL(window.location.origin).href) == "http://localhost:8080/") {
                this.redirect = encodeURIComponent("http://localhost:8080/focus");
                this.code = this.$route.query.code;
                if (this.code) {
                    this.getToken();
                    this.connected = true;
                }
            } else {
                this.redirect = encodeURIComponent("https://classo.netlify.app/focus");
                var params = new URLSearchParams(location.search);
                this.code = params.get('code');
                if (this.code) {
                    this.getToken();
                    this.connected = true;
                }
            }

            if (this.$store.state.user) {
                this.updateUserName();
            }
        },
        watch: {
            '$store.state.user.uid': function() {
                this.updateUserName();
            },
            genre() {
                this.getPlaylistByGenre();
            },
            userName() {
                this.firstLoad();
            },
            notes() {
                this.loader();
            }
        },
        data(){
            return {
                initLoad: false,
                userUID: null,
                userName: "",
                isFull: false,
                timeSec: 1500,
                active: false,
                paused: false,
                timer: null,
                toggle_none: null,
                page: 1,
                opened: false,
                focusDuration: null,
                focusStart: null,
                dialog: false,
                openedTitle: null,
                openedContent: null,
                openedID: null,
                openedIdx: null,
                newEntry: false,
                newTitle: "",
                newContent: "",
                addTime: 0,
                addID: null,
                spotify: false,
                notebook: false,
                alert: null,
                snackbar: false,
                notes: [],
                deleting: false,
                //spotify
                clientId: "0eac86f4d0f34d1ba4f2bfb6460a22d1",
                clientSecret: "958d23da24514d60b616482782d9aba4",
                redirect: "http%3A%2F%2Flocalhost%3A8080%2Ffocus",
                scopes: "user-read-playback-state%20user-modify-playback-state",
                connected: false,
                code: null,
                token: null,
                refreshToken: null,
                genres: null,
                selectedGenre: false,
                genreName: "",
                playlists: null,
                currPlaylist: null,
                selectedPlaylist: false,
                embed: "",
                searchInput: "",
                toggle_type: 0,
                type: "artist",
                selectedType: "artist",
                types: ["artist", "track", "album"],
                searchItems: [],
                selectedSearch: false,
                searchActive: false,
                searchReady: false,
                showBtn: true,
                noResults: false,
            }
        },
        computed: {
            min() {
                return String(Math.floor(this.timeSec/60)).padStart(2, '0');
            },
            sec() {
                return String(this.timeSec%60).padStart(2, '0');
            },
            toggle_none2: {
                get() {
                    if (this.spotify) {
                        return 0;
                    } else if (this.notebook) {
                        return 1;
                    } else {
                        return null;
                    }
                },
                set() {
                    return null;
                }
            },
            pages() {
                return Math.ceil(this.notes.length/6);
            },
            nextPage() {
                return (this.page-1)*6;
            },
            lastPage() {
                if (this.notes.length%6 == 0) {
                    return 6;
                } else {
                    return this.notes.length%6;
                } 
            },
            saveGray() {
                if (this.opened) {
                    if (this.openedTitle != "" && (this.openedTitle != this.notes[this.openedIdx].note_title || this.openedContent != this.notes[this.openedIdx].note_content)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            },
            addSaveGray() {
                if (this.newEntry && this.addTime == 0) {
                    if (this.newTitle == "") {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.newEntry && this.addTime != 0 && this.notes.length != 0) {
                    if (this.newTitle == "" || (this.newTitle == this.notes[0].note_title && this.newContent == this.notes[0].note_content)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            currentTimer() {
                return Number(this.sec) + Number(this.min) * 60;
            },
            growth() {
                if (this.focusDuration != null) {
                    if (this.focusDuration < 300) {
                        return require(`@/assets/images/1_seed.svg`);
                    } else if (this.focusDuration < 600) {
                        return require(`@/assets/images/2_sprout.svg`);
                    } else if (this.focusDuration < 900) {
                        return require(`@/assets/images/3_smol.svg`);
                    } else if (this.focusDuration < 1200) {
                        return require(`@/assets/images/4_grown.svg`);
                    } else if (this.focusDuration < 1500) {
                        return require(`@/assets/images/5_budding.svg`);
                    } else if (this.focusDuration == 1500) {
                        return require(`@/assets/images/6_bearing.svg`);
                    }
                } else {
                    if (this.currentTimer > 1200) {
                        return require(`@/assets/images/1_seed.svg`);
                    }
                    if (this.currentTimer <= 1200 && this.currentTimer > 900) {
                        return require(`@/assets/images/2_sprout.svg`);
                    }
                    if (this.currentTimer <= 900 && this.currentTimer > 600) {
                        return require(`@/assets/images/3_smol.svg`);
                    }
                    if (this.currentTimer <= 600 && this.currentTimer > 300) {
                        return require(`@/assets/images/4_grown.svg`);
                    }
                    if (this.currentTimer <= 300 && this.currentTimer > 0) {
                        return require(`@/assets/images/5_budding.svg`);
                    }
                    if (this.currentTimer == 0) {
                        return require(`@/assets/images/6_bearing.svg`);
                    }
                }
            },
            menuRight() {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return '0'
                    case 'sm': return '40px'
                    case 'md': return '40px'
                    case 'lg': return '40px'
                    case 'xl': return '40px'
                }
            },
            panelRight() {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return '10vw'
                    case 'sm': return '90px'
                    case 'md': return '90px'
                    case 'lg': return '90px'
                    case 'xl': return '90px'
                }
            },
            panelWidth() {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return '80vw'
                    case 'sm': return '300px'
                    case 'md': return '300px'
                    case 'lg': return '300px'
                    case 'xl': return '300px'
                }
            },
        },
        methods: {
            firstLoad() {
                this.initLoad = true;
            },
            updateUserName() {
                this.updateNotes();
                this.userUID = this.$store.state.user.uid;
                getDoc(doc(db, "users", this.userUID))
                .then((doc) => {
                    this.userName = doc.data().name;
                })
                .catch(err => {
                    console.log(err);
                })
            },
            updateNotes() {
                this.userUID = this.$store.state.user.uid;

                const q = query(collection(db, 'notebook'), where("user_id", "==", this.userUID), orderBy("date", "desc"))
                
                onSnapshot(q, (querySnapshot) => {
                this.notes = [];
                querySnapshot.docs.forEach((doc) => {
                    this.notes.push({ ...doc.data(), id: doc.id })
                })
                });
            },
            seconds() {
                if (!this.active) {
                    this.focusStart = firebase.firestore.Timestamp.fromDate(new Date());
                }
                this.active = true;
                this.paused = false;
                this.focusDuration = null;
                this.toggle_none = null;
                this.timeSec--;
                
                var time = this;
                if (this.timer != null) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                this.timer = setInterval(function () {
                    if (time.timeSec == 0) {
                        time.end();
                    } else {
                        time.timeSec--;
                    }
                }, 1000);
            },
            pause() {
                clearInterval(this.timer);
                this.timer = null;
                this.paused = true;
            },
            end() {
                clearInterval(this.timer);
                this.timer = null;
                this.paused = false;
                this.active = false;
                var focusTime = 1500 - this.timeSec;
                this.focusDuration = focusTime;
                this.alert = "You focused for " + Math.floor(focusTime / 60) + "min " + (focusTime % 60) + "s!";
                this.snackbar = true;
                this.timeSec = 1500;

                addDoc(collection(db, 'focus'), {
                    focus_duration: focusTime,
                    focus_start: this.focusStart,
                    user_id: this.$store.state.user.uid
                })
                .then((snapshot) => {
                })
                .catch(err => {
                    console.log(err);
                })
            },
            view(idx) {
                this.openedTitle = this.notes[idx].note_title;
                this.openedContent = this.notes[idx].note_content;
                this.openedID = this.notes[idx].id;
                this.openedIdx = idx;
                this.opened = true;
            },
            save() {
                const newNotesRef = doc(db, "notebook", this.openedID);
                updateDoc(newNotesRef, {
                    note_title: this.openedTitle,
                    note_content: this.openedContent,
                })
                .then((snapshot) => {
                })
                .catch(err => {
                    console.log(err);
                })
            },
            loader() {
                this.deleting = false;
                if (this.dialog) {
                    this.dialog = false;
                    this.opened = false;
                }
            },
            close() {
                this.opened = false;
                this.newEntry = false;
                this.newTitle = "";
                this.newContent = "";
                this.addTime = 0;
            },
            addOpen() {
                this.newEntry = true;
            },
            add() {
                this.addTime++;
                if (this.addTime == 1) {
                    addDoc(collection(db, 'notebook'), {
                        note_title: this.newTitle,
                        note_content: this.newContent,
                        user_id: this.$store.state.user.uid,
                        date: firebase.firestore.Timestamp.fromDate(new Date())
                    })
                    .then((snapshot) => {
                        this.addID = snapshot.id;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                } else {
                    this.saveNew();
                }
            },
            saveNew() {
                const newNotesRef = doc(db, "notebook", this.addID);
                updateDoc(newNotesRef, {
                    note_title: this.newTitle,
                    note_content: this.newContent
                })
                .then((snapshot) => {
                })
                .catch(err => {
                    console.log(err);
                })
            },
            del() {
                if (this.dialog) {
                    this.deleting = true;
                }
                const delNotesRef = doc(db, "notebook", this.openedID);
                deleteDoc(delNotesRef, {
                })
                .then((snapshot) => {
                })
                .catch(err => {
                    console.log(err);
                })
            },
            //spotify
            authorize() {
                window.location=`https://accounts.spotify.com/authorize?client_id=${this.clientId}&scope=${this.scopes}&response_type=code&redirect_uri=${this.redirect}`;
            },
            logOut() {
                let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                width=600,height=600,left=100,top=100`;
                
                const spotifyLogoutWindow = open('https://accounts.spotify.com/en/logout', 'Log Out', params);
                window.history.pushState({}, document.title, "/" + "focus");
                this.connected = false;
                setTimeout(()=> spotifyLogoutWindow.close(), 1000);
            },
            async getToken() {
                const result = await fetch(`https://accounts.spotify.com/api/token`, {
                    method: 'POST',
                    body: `code=${this.code}&redirect_uri=${this.redirect}&grant_type=authorization_code`,
                    headers: {
                        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
                        'Content-Type' : 'application/x-www-form-urlencoded', 
                    },
                    json: true
                });
                if (!result.ok && !this.refreshToken) {
                    this.authorize();
                } else if (!result.ok && this.refreshToken) {
                    this.getRefreshToken();
                } else {
                    const data = await result.json();
                    this.token = data.access_token;
                    this.refreshToken = data.refresh_token;
                    this.getGenres();
                }
            },
            async getRefreshToken() {
                const result = await fetch(`https://accounts.spotify.com/api/token`, {
                    method: 'POST',
                    body: `grant_type=refresh_token&refresh_token=${this.refreshToken}`,
                    headers: {
                        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
                        'Content-Type' : 'application/x-www-form-urlencoded', 
                    },
                    json: true
                });
                
                const data = await result.json();
                this.token = data.access_token;
                this.getGenres();
            },
            async getGenres() {
                this.genres = [];

                const result = await fetch(`https://api.spotify.com/v1/browse/categories`, {
                    method: 'GET',
                    headers: { 'Authorization' : 'Bearer ' + this.token}
                });

                const data = await result.json();
                for (var item of data.categories.items) {
                    if (await this.checkPlaylist(item)) {
                        this.genres.push(item);
                    }
                }
                console.log(this.genres);
            },
            async checkPlaylist(genre) {                
                const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genre.id}/playlists?limit=40`, {
                    method: 'GET',
                    headers: { 'Authorization' : 'Bearer ' + this.token}
                });

                const data = await result.json();
                if (result.ok) {
                    return true;
                } else {
                    return false;
                }
            },
            async getPlaylistByGenre(genre) {
                this.playlists = [];

                this.selectedGenre = true;
                this.genreName = genre.name;
                
                const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genre.id}/playlists?limit=40`, {
                    method: 'GET',
                    headers: { 'Authorization' : 'Bearer ' + this.token}
                });

                var taken = [];
                const data = await result.json();
                for (var item of data.playlists.items) {
                    if (item && !taken.includes(item.id)) {
                        taken.push(item.id);
                        this.playlists.push(item);
                    }
                }
                console.log(this.playlists);
            },
            backSpotify(screen) {
                if (screen == 1) {
                    this.selectedGenre = false;
                } else if (screen == 2) {
                    this.selectedPlaylist = false;
                } else if (screen == 3) {
                    this.selectedSearch = false;
                }
            },
            embedPlaylist(id) {
                this.selectedPlaylist = true;
                this.embed = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
            },
            async searchSpotify() {
                this.searchReady = false;
                if (this.searchInput) {
                    this.showBtn = false;
                    this.searchActive = true;
                    
                    var input = this.searchInput.replaceAll(" ", "%20");
                    this.type = this.types[this.toggle_type];
                    var type = this.types[this.toggle_type].replaceAll(",", "%2C");

                    const result = await fetch(`https://api.spotify.com/v1/search?q=${input}&type=${type}&limit=40`, {
                        method: 'GET',
                        headers: { 'Authorization' : 'Bearer ' + this.token}
                    });

                    const data = await result.json();
                    
                    await this.filter(data[this.types[this.toggle_type]+"s"].items);
                } else {
                    this.searchActive = false;
                }
            },
            async filter(items) {
                this.searchItems = [];
                var taken = [];
                var type = this.types[this.toggle_type].replaceAll(",", "%2C");
                
                for (var item of items) {
                    if (!taken.includes(item.id)) {
                        if (type == "artist" || type == "album") {
                            if (item.images && item.images.length != 0) {
                                taken.push(item.id);
                                this.searchItems.push(item);
                            }
                        } else if (type == "track") {
                            if (item.album && item.album.images.length != 0) {
                                taken.push(item.id);
                                this.searchItems.push(item);
                            }
                        }
                    }
                }
                this.searchReady = true;
                this.showBtn = true;

                if (this.searchItems.length == 0) {
                    this.noResults = true;
                } else {
                    this.noResults = false;
                }

            },
            clearInput() {
                this.searchInput = "";
                this.searchActive = false;
            },
            embedPlayer(type, id) {
                this.selectedSearch = true;
                this.selectedType = type;
                this.embed = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
            }
        }
    };
</script>

<style lang="css" scoped>
    @media only screen and (min-device-width: 411px) and (max-device-width: 823px) {
    }
    .focus-bg {
        background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url('@/assets/images/focus-bg.jpg');
        background-size: cover;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
    }
    .initial-load {
        position: absolute;
        top: 0;
        left: 0;
        background-color: black;
        background-size: cover;
        min-height: 100%;
        min-width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .init-loading-text {
        font-size: 3rem;
        letter-spacing: 3px !important;
        font-family: "Vibur", sans-serif !important;
        color: #fee;
    }
    .loader {
        width: 100%;
        height: 100%;
        padding: 0 20px;
    }
    .deleteLoad {
        width: 290px;
        height: 174px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .fadeOut {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 0.2s, opacity 0.2s linear;
    }
    .header {
        padding-left: 40px;
        padding-top: 10px;
        font-size: 9vw;
        letter-spacing: 3px !important;
        font-family: "Vibur", sans-serif !important;
        color: #fee;
        text-shadow:
        0 -40px 100px, 0 0 2px,
        0 0 1em #8F7691,
        0 0 0.5em #8F7691,
        0 0 0.1em #8F7691,
        0 0 0.4em #8F7691,
        0 10px 3px #000;
    }
    .card-glass {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        padding: 20px;
    }
    .card-dark {
        background-color: black;
        border-radius: 16px;
        color: white;
        padding: 20px;
        width: 100%;
        height: 370px;
        overflow: auto;
        overflow-x: hidden;
    }
    .card-dark-2 {
        position: relative;
        background-color: #202020;
        border-radius: 16px;
        color: white;
        width: 100%;
        height: 370px;
    }
    .card-dark-3 {
        position: relative;
        background: linear-gradient( rgba(32, 32, 32), rgba(0, 0, 0) );
        border-radius: 16px;
        color: white;
        width: 100%;
        height: 370px;
    }
    .card-title {
        font-size: 1.2rem;
        font-weight: bolder;
    }
    .mini-card {
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 10px;
    }
    .activity-time {
        color: gray;
    }
    .timer {
        font-size: 2rem;
        font-weight: bolder;
        text-align: center;
        margin: 15px 0;
    }
    .view-pen {
        margin: 12px 20px;
        padding: 15px;
        height: 329px;
        border-radius: 10px;
        border: 1px solid rgb(255,255,255,0.4);
    }
    .notebook {
        position: relative;
        height: 100%;
    }
    .note {
        border-bottom: 2px solid rgb(255,255,255,0.05);
        padding: 12px 0;
        margin: 0 20px;
        color: black;
        color: white;
    }
    .note:hover {
        background-color: rgb(255,255,255,0.1);
        margin: 0;
        padding: 12px 20px;
    }
    .pagination {
        position: absolute;
        bottom: 20px;
        width: 100%;
    }
    input[type="text"] {
        background: transparent;
        border: none;
        color: white;
    }
    input[type="text"]:focus {
        background: transparent;
        border: none;
        outline-width: 0;
    }
    .input-title {
        font-weight: bolder;
        font-size: 1.05rem;
        width: 100%;
        color: white;
        margin-bottom: 10px;
    }
    .input-body {
        font-size: 0.85rem;
        font-weight: normal;
        width: 100%;
        color: white;
    }
    textarea {
        background: transparent;
        border: none;
        overflow-wrap: break-word;
        height: 82%;
        resize: none;
    }
    textarea:focus {
        background: transparent;
        border: none;
        outline-width: 0;
    }
    .garden {
        margin-top: 20px;
        text-align: center;
        width: 100%;
        aspect-ratio: 6/1;
        position: relative;
    }
    .tree {
        width: 100%;
        height: auto;
    }
    .menu {
        position: absolute;
        right: 40px;
        bottom: 44%;
        flex-direction: column;
    }
    .menu-xs {
        position: fixed;
        right: calc(50vw - 49.5px);
        bottom: 0;
    }
    .corners-1 {
        border-radius: 5px 5px 0 0 !important;
    }
    .corners-2 {
        border-radius: 0px 0px 5px 5px !important;
    }
    .panel {
        top: 20% !important;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        padding: 20px 0;
    }
    .fog {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.7);
    }
    ::-webkit-input-placeholder { /* Edge */
        color: #cfcfcf;;
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #cfcfcf;
    }

    ::placeholder {
        color: #cfcfcf;
    }
    .genre {
        background-size: contain;
        border-radius: 10px;
        margin-bottom: 20px;
        overflow-wrap: break-word;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
    }
    .item-name {
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .caption {
        font-size: 0.7em;
        font-weight: bold;
        color: DarkGray;
    }
    .close {
        position: absolute;
        top: 20px !important;
        left: 15px;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: transparent; 
    }
    ::-webkit-scrollbar-thumb {
        background: Silver;
        border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: DarkGray; 
    }
    .input-x {
        position: absolute;
        top: 20px;
        right: 20px;
    }
</style>