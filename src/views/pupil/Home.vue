<template>
  <main>
    <Search v-model="search" class="search"/>
    <transition name="fade">
      <div v-if="filteredLessons && filteredLessons.length" class="journal-cards">
        <JournalCard
          v-for="lesson in filteredLessons"
          :key="lesson.id"
          :lesson="lesson"
          class="card"
        />
      </div>
      <NoResults v-else-if="!loading"/>
    </transition>
  </main>
</template>

<script>

import Search from '@/components/Search.vue';
import JournalCard from '@/components/journal/JournalCard.vue';
import Pupil from '@/api/pupil';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'Home',

  components: {
    Search,
    JournalCard,
    NoResults,
  },

  data() {
    return {
      search: '',
      journal: null,
      loading: true,
    };
  },

  computed: {
    filteredLessons() {
      const search = this.search.toLowerCase();
      return this.journal?.filter((lesson) => lesson.name.toLowerCase()
        .includes(search));
    },
  },

  async created() {
    await this.getJournal();
    this.loading = false;
  },

  methods: {
    async getJournal() {
      const response = await Pupil.getJournal();
      this.journal = response.data;
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  max-width: 900px;
  margin: 0 20px;
}

.journal-cards {
  width: auto;
  margin: 20px 20px 0;
  display: flex;
  flex-wrap: wrap;

  .card {
    //width: calc(45% - 20px);
    margin: 10px;
  }
}
</style>
