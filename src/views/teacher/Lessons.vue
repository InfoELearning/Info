<template>
  <main>
    <div class="search-container">
      <Search v-model="search" class="search"/>
      <button
        class="create-lesson"
        @click="isCreateModalOpen = true"
      >
        <span>+</span> создать
      </button>
    </div>

    <transition name="fade">
      <div v-if="filteredLessons && filteredLessons.length" class="lessons">
        <TeacherLessonCard
          v-for="lesson in filteredLessons"
          :key="lesson.id"
          :lesson="lesson"
          class="lesson"
          @selectLesson="selectLesson(lesson)"
        />
      </div>
      <NoResults
        v-else-if="!loading"
      />
    </transition>

    <CreateLessonModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @submitModal="createLesson"
    />
    <EditLessonModal
      v-if="isEditModalOpen"
      :lesson="selectedLesson"
      @close="isEditModalOpen = false"
      @submitModal="editLesson"
    />
  </main>
</template>

<script>
import Search from '@/components/Search.vue';
import TeacherLessonCard from '@/components/teacher/lessons/TeacherLessonCard.vue';
import Teacher from '@/api/teacher';
import CreateLessonModal from '@/components/teacher/lessons/CreateLessonModal.vue';
import EditLessonModal from '@/components/teacher/lessons/EditLessonModal.vue';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'Lessons',

  components: {
    Search,
    TeacherLessonCard,
    CreateLessonModal,
    EditLessonModal,
    NoResults,
  },

  data() {
    return {
      search: '',
      lessons: null,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      selectedLesson: null,
      loading: true,
    };
  },

  computed: {
    filteredLessons() {
      const search = this.search.toLowerCase();
      return this.lessons?.filter((lesson) => lesson.name.toLowerCase()
        .includes(search));
    },
  },

  async created() {
    await this.getLessons();
    this.loading = false;
  },

  methods: {
    async getLessons() {
      const response = await Teacher.getLessons();
      this.lessons = response.data;
    },

    selectLesson(lesson) {
      this.selectedLesson = lesson;
      this.isEditModalOpen = true;
    },

    async createLesson(lesson) {
      await Teacher.createLesson(lesson);
      await this.getLessons();
      this.isCreateModalOpen = false;
    },

    async editLesson(lesson) {
      await Teacher.editLesson(lesson.id, lesson);
      await this.getLessons();
      this.isEditModalOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  padding-right: 20px;
}

.search-container {
  display: flex;

  @media (max-width: 750px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .create-lesson {
      margin-top: 15px;
    }
  }

  .search {
    max-width: 900px;
    margin: 0 20px;
    width: 100%;
  }

  .create-lesson {
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

.lessons {
  width: auto;
  margin: 20px 20px 0;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 750px) {
    width: 100%;
    margin: 0;
  }

  .lesson {
    margin: 25px;
    min-width: 210px;

    @media (max-width: 750px) {
      width: 100%;
      margin: 25px 5px;
    }
  }
}
</style>
