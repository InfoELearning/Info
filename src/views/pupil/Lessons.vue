<template>
  <main>
    <Search v-model="search" class="search"/>
    <transition name="fade">
      <div v-if="filteredLessons && filteredLessons.length" class="lessons">
        <LessonCard
          v-for="lesson in filteredLessons"
          :key="lesson.id"
          class="lesson"
          :lesson="lesson"
        />
      </div>
      <NoResults
        v-else-if="!loading"
      />
    </transition>
  </main>
</template>

<script>
import Search from '@/components/Search.vue';
import LessonCard from '@/components/pupil/lessons/LessonCard.vue';
import Pupil from '@/api/pupil';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'Lessons',

  components: {
    LessonCard,
    Search,
    NoResults,
  },

  data() {
    return {
      search: '',
      lessons: null,
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
      const response = await Pupil.getLessons();
      this.lessons = response.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  max-width: 900px;
  margin: 0 20px;
}

.lessons {
  width: auto;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;

  .lesson::v-deep {
    margin: 25px;

    .teacher-avatar {
      @media (max-width: 750px) {
        display: none;
      }
    }
  }
}
</style>
