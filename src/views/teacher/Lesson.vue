<template>
  <transition name="fade">
    <main v-if="lesson">
      <div class="lesson">
        <LessonHeader :lesson="lesson"/>
        <div class="search-container">
          <Search v-model="search" class="search"/>
          <button
            class="create-lesson"
            @click="isCreateModalOpen = true"
          >
            <span>+</span> создать
          </button>
        </div>
        <div v-if="filteredTasks && filteredTasks.length" class="lessons__body">
          <HomeWorkCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            class="homework-card"
            @selectTask="selectTask(task)"
          />
        </div>
        <NoResults
          v-else-if="!loading"
        />
      </div>

      <transition name="fade">
        <CreateTaskModal
          v-if="isCreateModalOpen"
          @close="isCreateModalOpen = false"
          @submitModal="createTask"
        />
      </transition>

      <transition name="fade">
        <EditTaskModal
          v-if="isEditModalOpen"
          :task="selectedTask"
          @close="isEditModalOpen = false"
          @submitModal="editTask"
        />
      </transition>
    </main>
  </transition>
</template>

<script>
import Teacher from '@/api/teacher';
import Pupil from '@/api/pupil';
import Search from '@/components/Search.vue';
import HomeWorkCard from '@/components/teacher/lesson/HomeworkListCard.vue';
import CreateTaskModal from '@/components/teacher/lesson/CreateTaskModal.vue';
import EditTaskModal from '@/components/teacher/lesson/EditTaskModal.vue';
import LessonHeader from '@/views/teacher/LessonHeader.vue';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'Lesson',

  components: {
    Search,
    HomeWorkCard,
    CreateTaskModal,
    EditTaskModal,
    LessonHeader,
    NoResults,
  },

  data() {
    return {
      lesson: null,
      tasks: null,
      search: '',
      isCreateModalOpen: false,
      isEditModalOpen: false,
      selectedTask: null,
      loading: true,
    };
  },
  computed: {
    filteredTasks() {
      const search = this.search.toLowerCase();
      return this.tasks?.filter((task) => task.name.toLowerCase()
        .includes(search));
    },
  },

  async created() {
    await this.getLesson();
    await this.getTasks();
    this.loading = false;
  },

  methods: {
    async getLesson() {
      const lessonId = this.$route.params.id;
      const response = await Pupil.getLesson(lessonId);
      this.lesson = response.data;
    },

    async getTasks() {
      const lessonId = this.$route.params.id;
      const response = await Teacher.getTasks(lessonId);
      this.tasks = response.data;
    },

    selectTask(task) {
      this.selectedTask = task;
      this.isEditModalOpen = true;
    },

    async createTask(task) {
      await Teacher.createTask(task);
      await this.getTasks();
      this.isCreateModalOpen = false;
    },

    async editTask(task) {
      await Teacher.editTask(task.id, task);
      await this.getTasks();
      this.isEditModalOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
}

.search-container {
  display: flex;
  margin: 20px 40px;

  .search {
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 200px;
  }

  @media (max-width: 750px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .create-lesson {
      margin-top: 15px;
    }
  }

  .search {
    //max-width: 900px;
    width: 100%;
  }

  .create-lesson {
    margin-left: 20px;
    background: #629CF2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;
    padding: 0 20px;
    font-size: 22px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 200px;
    min-height: 50px;

    span {
      font-size: 25px;
      font-weight: 800;
      margin-top: 3px;
      margin-right: 5px;
    }
  }
}

.lesson {
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  max-width: 1200px;
  padding: 0 0 20px;
  margin-right: 20px;
  width: 100%;

  .lessons__body {
    margin-top: 40px;
    padding: 0 40px;

    @media (max-width: 750px) {
      padding: 0 5px;
    }

    .homework-card::v-deep {
      margin-top: 10px;
    }
  }
}
</style>
