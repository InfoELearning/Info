<!--eslint-disable-->
<template>
  <main>
    <div class="main-block">
      <div class="video-block">
        <div class="video-container" v-show="!selectedVideo">
          <video width="480"
                 ref="myvideo"
                 autoplay
                 @click="selectedVideo = userVideoStream"
                 muted
                 poster="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png">
            Your browser doesn't support HTML5 video tag.
          </video>
          <video width="480"
                 autoplay
                 v-for="video in videoStreams"
                 :key="video.userId"
                 :srcObject.prop="video.stream"
                 @click="selectedVideo = video"
                 poster="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png">
            Your browser doesn't support HTML5 video tag.
          </video>
        </div>
        <div v-if="selectedVideo" class="video-container">
          <video width="480"
                 class="selected-video"
                 autoplay
                 muted
                 :srcObject.prop="selectedVideo.stream"
                 @click="selectedVideo = null">
            Your browser doesn't support HTML5 video tag.
          </video>
        </div>
        <div class="controls-block">
          <ion-icon
            class="disabled"
            v-show="!userVideoStream.audio"
            @click="unmuteVideo"
            name="mic-off-outline"
          />
          <ion-icon

            v-show="userVideoStream.audio"
            @click="muteVideo"
            name="mic-outline"
          />
          <ion-icon
            class="disabled"
            v-show="!userVideoStream.video"
            @click="startVideo"
            name="videocam-off-outline"
          />
          <ion-icon

            v-show="userVideoStream.video"
            @click="stopVideo"
            name="videocam-outline"
          />
          <ion-icon
            @click="endCall"
            name="call-outline"
            class="red"
          />
          <ion-icon
            v-show="!userVideoStream.screenCast"
            name="desktop-outline"
            @click="startDemonstrationScreen"
          />
          <ion-icon
            class="disabled"
            v-show="userVideoStream.screenCast"
            name="desktop-outline"
            @click="stopDemonstrationScreen"
          />
          <ion-icon
            v-show="!mediaRecorder"
            @click="startRecord"
            name="radio-button-on-outline"
          />
          <ion-icon
            class="disabled"
            v-show="mediaRecorder"
            @click="stopRecord"
            name="stop-circle-outline"
          />
        </div>
      </div>
      <div class="chat-block">
        <div class="tabs">
          <ion-icon class="message-tab" name="chatbubbles-outline"></ion-icon>
          <!--          <ion-icon class="people-tab" name="people-outline"></ion-icon>-->
        </div>
        <div class="chat-container">
          <div class="messages">
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="message"
            >
              <Avatar class="avatar" />
              <div class="comment-container">
                <div class="comment-info">
                  <p class="author">{{ message.author }}</p>
                  <p class="date"> {{ format(new Date(message.date), 'HH:mm') }}</p>
                </div>
                <div class="comment">
                  {{ message.text }}
                </div>
              </div>
            </div>
          </div>
          <div class="send-block">
            <div class="send-container">
              <Avatar class="avatar" />
              <input v-model="messageInput" class="comment" @keypress.enter="sendMessage">
            </div>
            <div class="send-message-container">
              <button @click="sendMessage">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
/* eslint-disable */
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import RecordRtc from 'recordrtc';
import { format } from 'date-fns';
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'VideoRoom',

  components: {
    Avatar,
  },

  data() {
    return {
      selectedVideo: null,
      roomId: this.$route.params.id,
      userVideoStream: {
        stream: null,
        video: true,
        audio: true,
        screenCast: false,
        record: false,
      },
      socket: null,
      userPeer: null,
      mediaRecorder: null,
      mediaRecorderStream: null,
      videoStreams: [],
      messageInput: '',
      messages: [],
    };
  },

  computed: {},

  watch: {},

  async created() {
    try {
      this.userVideoStream.stream = await this.getVideoStream();
    }
    catch  {
      await this.showError('Для подключения к комнате необходимо дать разрешение на использование видеокамеры и микрофона');
      await this.$router.push('/');
      return;
    }

    console.log('',this.userVideoStream.stream);

    this.socket = io(process.env.VUE_APP_ROOT_SOCKETS_API);

    this.socket.on('get-all-messages', (messages) => {
      this.messages = messages;
    });

    this.userPeer = new Peer(undefined, { host: 'peerjs-server.herokuapp.com', secure: true, port: 443 });

    this.userPeer.on('open', (userId) => {
      this.socket.emit('join-room', this.roomId, userId);

      this.socket.on('get-message', (message) => {
        this.addMessage(message);
      });
    });

    this.startVideo();

    this.socket.on('user-disconnected', (userId) => {
      this.videoStreams = this.videoStreams.filter((stream) => stream.userId !== userId);
    });

    this.userPeer.on('call', (call) => {
      const userId = call.peer;
      call.answer(this.userVideoStream.stream);

      this.videoStreams.push({
        userId,
      });

      call.on('stream', (userVideoStream) => {
        this.videoStreams = this.videoStreams.map((videoStream) => {
          if (videoStream.userId === userId) {
            videoStream.stream = userVideoStream;
          }
          return videoStream;
        });
      });
    });

    this.socket.on('user-connected', (userId) => {
      this.connectToNewUser(userId, this.userVideoStream.stream);
    });
  },

  mounted() {
  },

  beforeDestroy() {
    try {
      this.socket.disconnect();

      this.userVideoStream.stream.getTracks().forEach((track) => track.stop());
    }
    catch (error) {
      console.log(error);
    }

  },

  methods: {
    format,

    connectToNewUser(userId, stream) {
      const call = this.userPeer.call(userId, stream);

      this.videoStreams.push({
        userId,
      });

      call.on('stream', (userVideoStream) => {
        this.videoStreams = this.videoStreams.map((videoStream) => {
          if (videoStream.userId === userId) {
            videoStream.stream = userVideoStream;
          }
          return videoStream;
        });
      });

      call.on('close', () => {
        this.videoStreams = this.videoStreams
          .filter((videoStream) => videoStream.userId !== userId);
      });
    },

    async getVideoStream() {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    },

    async getDisplayMedia() {
      return await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
    },

    async startDemonstrationScreen() {
      this.userVideoStream.stream = await this.getDisplayMedia();
      this.userVideoStream.screenCast = true;

      for (const [key] of this.userPeer._connections.entries()) {
        this.replaceStream(this.userPeer._connections.get(key)[0].peerConnection, this.userVideoStream.stream);
      }

      this.userVideoStream.stream.oninactive = () => {
        this.stopDemonstrationScreen();
      };

      this.$refs.myvideo.srcObject = this.userVideoStream.stream;
    },

    replaceStream(peerConnection, mediaStream) {
      if (peerConnection && mediaStream) {
        for (const sender of peerConnection.getSenders()) {
          if (sender.track.kind === 'audio') {
            if (mediaStream.getAudioTracks().length > 0) {
              sender.replaceTrack(mediaStream.getAudioTracks()[0]);
            }
          }
          if (sender.track.kind === 'video') {
            if (mediaStream.getVideoTracks().length > 0) {
              sender.replaceTrack(mediaStream.getVideoTracks()[0]);
            }
          }
        }
      }
    },

    async stopDemonstrationScreen() {
      this.userVideoStream.screenCast = false;

      this.userVideoStream.stream.getTracks().forEach((track) => track.stop());

      this.userVideoStream.stream = await this.getVideoStream();

      this.startVideo();

      for (const [key] of this.userPeer._connections.entries()) {
        this.replaceStream(this.userPeer._connections.get(key)[0].peerConnection, this.userVideoStream.stream);
      }
    },

    startVideo() {
      this.userVideoStream.video = true;
      this.$refs.myvideo.srcObject = this.userVideoStream.stream;
      this.userVideoStream.stream.getVideoTracks()[0].enabled = true;
    },

    stopVideo() {
      this.userVideoStream.video = false;
      this.userVideoStream.stream.getVideoTracks()[0].enabled = false;
    },

    muteVideo() {
      this.userVideoStream.audio = false;
      this.userVideoStream.stream.getAudioTracks()[0].enabled = false;
    },

    unmuteVideo() {
      this.userVideoStream.audio = true;
      this.userVideoStream.stream.getAudioTracks()[0].enabled = true;
    },

    endCall() {
      this.socket.disconnect();

      this.userVideoStream.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.$router.push('/');
    },

    async startRecord() {
      this.mediaRecorderStream = await this.getDisplayMedia();
      const audioTrack = this.userVideoStream.stream.getAudioTracks()[0];
      this.mediaRecorderStream.addTrack(audioTrack);
      this.mediaRecorder = new RecordRtc.RecordRTCPromisesHandler(this.mediaRecorderStream, {
        type: 'video',
        disableLogs: true,
      });
      this.mediaRecorder.startRecording();

      this.mediaRecorderStream.getVideoTracks()[0].addEventListener('ended', () => this.stopRecord());
    },

    async stopRecord() {
      await this.mediaRecorder.stopRecording();

      const blob = await this.mediaRecorder.getBlob();

      RecordRtc.getSeekableBlob(blob, (seekableBlob) => {
        RecordRtc.invokeSaveAsDialog(seekableBlob, 'seekable-recordrtc.mp4');
        this.mediaRecorder = null;

        this.mediaRecorderStream.getVideoTracks().forEach((track) => {
          track.stop();
        });
      });
    },

    addMessage(message) {
      this.messages.push(message);

      setTimeout(() => {
        const messages = document.getElementsByClassName('messages')[0];
        messages.scrollTop = messages.scrollHeight;
      });
    },

    sendMessage() {
      if (!this.messageInput.trim()) return;

      const message = {
        author: `${this.$store.state.user.user.firstName} ${this.$store.state.user.user.lastName}`,
        date: new Date(),
        text: this.messageInput,
      };

      this.addMessage(message);

      this.socket.emit('send-message', this.roomId, message);

      this.messageInput = '';
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  min-width: 800px;
  //max-width: 1200px;
  padding: 20px;
  height: 100vh;
  display: flex;
}

ion-icon {
  cursor: pointer;
}
ion-icon.disabled {
  background: #ACACAC!important;
}

.main-block {
  border-radius: 25px;
  overflow: hidden;
  display: flex;
}

.video-block {
  //width: 70%;
  width: 1590px;
  background: rgba(189, 217, 248, 0.8);

  .video-container {
    height: 90%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    overflow: auto;
    overflow-x: hidden;


    video {
      cursor: pointer;
      width: 300px;
      height: 230px;
      margin: 25px;
      object-fit: cover;
      border-radius: 25px;
    }
    .selected-video{
      width: 95%;
      height: auto;
    }
  }

  .controls-block {
    height: 10%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #78B0F4;

    ion-icon {
      font-size: 27px;
      padding: 5px 20px;
      color: white;
      border-radius: 15px;
      background: #464FEA;

      &.red {
        background: #E82012;
      }
    }
  }
}

.chat-block {
  width: 700px;
  //width: 30%;
  background: #78B0F4;

  .tabs {
    display: flex;
    justify-content: center;

    .message-tab {
      color: white;
      background: #ED7D2B;
      font-size: 27px;
      border-radius: 15px;
      padding: 10px 40px;
      margin: 10px;
    }

    .people-tab {
      color: white;
      background: #464FEA;
      border-radius: 15px;
      font-size: 27px;
      padding: 10px 40px;
      margin: 10px;
    }
  }

  .chat-container {
    border-radius: 15px;
    height: 89%;
    min-width: 320px;
    background: white;
    margin: 0 10px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .messages {
      padding: 10px;
      overflow: hidden;
      overflow-y: auto;

      .message {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .avatar {
          height: 60px;
          width: 60px;
          object-fit: cover;
          border-radius: 50%;
        }

        .comment-container {
          width: 100%;
          //margin-right: 25px;
        }

        .comment-info {
          display: flex;
          justify-content: space-between;

          .author {
            padding-left: 10px;
            font-size: 18px;
          }

          .date {
            font-size: 18px;
            color: #8A8580;
          }
        }

        .comment {
          margin-left: 7px;
          border: 1px solid #D1D1D1;
          border-radius: 10px 10px 10px 0;
          padding: 16px;
          background-color: #fff;
          height: auto;
          font-size: 20px;
          word-break: break-word;
        }
      }
    }

    .send-block {
      border-top: 1px solid #DCDCDC;

      .send-container {
        display: flex;
        align-items: center;
        padding: 10px;

        .avatar {
          height: 60px;
          width: 60px;
          object-fit: cover;
          border-radius: 50%;
        }

        .comment {
          margin-left: 7px;
          border: 1px solid #D1D1D1;
          box-sizing: border-box;
          border-radius: 8px;
          padding: 16px;
          width: 100%;
          font-size: 14px;
          height: 75px;
          background-color: #f8f8f8;
          resize: none;
          outline: none;
        }
      }

      .send-message-container {
        padding: 10px;

        button {
          padding: 10px;
          width: 100%;
          font-size: 25px;
          color: #FFFFFF;
          background: linear-gradient(0deg, rgba(142, 196, 245, 0.5), rgba(142, 196, 245, 0.5)), #629CF2;
          border: 1px solid #ACACAC;
          box-sizing: border-box;
          border-radius: 10px;
        }
      }
    }

    .peoples {
      padding: 0 20px;

      .people-info {
        display: flex;
        align-items: center;
        margin-top: 15px;

        .avatar {
          height: 40px;
          width: 40px;
          object-fit: cover;
          border-radius: 50%;
        }

        .name {
          margin-left: 10px;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
