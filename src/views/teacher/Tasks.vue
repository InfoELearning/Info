<template>
    <main>
      <div v-if="lesson" class="lesson">
        <LessonHeader :lesson="lesson"/>
        <div class="task__filters">
          <button
            class="task__filters-item"
            :class="{'disabled': selectedFilter !== 'completed'}"
            @click="selectedFilter = 'completed'"
          >
            <span class="filters-item__title">Опубликованы</span>
            <img src="../../assets/icons/completed.png"/>
            <span class="filters-item__count">{{ completedTasks.length }}</span>
          </button>
          <button
            class="task__filters-item"
            :class="{'disabled': selectedFilter !== 'waiting'}"
            @click="selectedFilter = 'waiting'"
          >
            <span class="filters-item__title">Ожидают публикации</span>
            <img src="../../assets/icons/waiting.png"/>
            <span class="filters-item__count">{{ waitingTasks.length }}</span>
          </button>
          <button
            class="task__filters-item"
            :class="{'disabled': selectedFilter !== 'archive'}"
            @click="selectedFilter = 'archive'"
          >
            <span class="filters-item__title">Архив</span>
            <img src="../../assets/icons/archive.png"/>
            <span class="filters-item__count">{{ archiveTasks.length }}</span>
          </button>
        </div>
        <div class="lessons__body">
          <transition-group name="fade">
          <HomeWorkCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            class="homework-card"
          />
          </transition-group>
        </div>
      </div>
    </main>
</template>

<script>
import LessonHeader from '@/views/teacher/LessonHeader.vue';
import Pupil from '@/api/pupil';
import Teacher from '@/api/teacher';
import HomeWorkCard from '@/components/teacher/lesson/HomeworkListCard.vue';

export default {
  name: 'Tasks',
  components: {
    LessonHeader,
    HomeWorkCard,
  },

  data() {
    return {
      tasks: null,
      lesson: null,
      selectedFilter: 'completed',
      waitingTasks: [],
      completedTasks: [],
      archiveTasks: [],
    };
  },

  computed: {
    filteredTasks() {
      switch (this.selectedFilter) {
        case 'completed':
          return this.completedTasks;
        case 'waiting':
          return this.waitingTasks;
        case 'archive':
          return this.archiveTasks;
        default:
          return [];
      }
    },
  },

  async created() {
    await this.getLesson();
    await this.getTasks();
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

      this.waitingTasks = this.tasks
        .filter((task) => new Date(task.dateStart) > new Date());
      this.completedTasks = this.tasks
        .filter((task) => new Date(task.dateEnd) > new Date()
          && new Date(task.dateStart) <= new Date());
      this.archiveTasks = this.tasks
        .filter((task) => new Date(task.dateEnd) < new Date());
    },
  },
};
</script>

<style lang="scss" scoped>
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

.task__filters {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;

  .task__filters-item {
    height: 120px;
    width: 120px;
    font-size: 17px;
    background: #1F73EF;
    box-shadow: 0px 6px 10px rgba(31, 115, 239, 0.14);
    border-radius: 15px;
    color: #FFFFFF;
    display: flex;
    //justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;

    &.disabled {
      background: linear-gradient(
          0deg, rgba(142, 196, 245, 0.5), rgba(142, 196, 245, 0.5)), #bcd8f3;
    }

    .filters-item__title {
      flex: 1.5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .filters-item__icon {
      flex: 1;
    }

    .filters-item__count {
      flex: 1;
      font-size: 20px;
      font-weight: bold;
    }
  }
}

.main{
  display: flex;
  justify-content: center;
}
</style>
