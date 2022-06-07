<template>
  <main>
    <transition name="fade">
      <div v-if="task" class="task">
        <LessonHeader :lesson="task.lesson"/>
        <div class="task__body">
          <HomeworkCard
            :task="task"
            @editTask="isEditModalOpen = true"
          />
        </div>
        <transition name="fade">
          <div v-if="!selectedHomework">
            <div class="task__filters">
              <button
                class="task__filters-item"
                :class="{'disabled': selectedFilter !== 'waiting'}"
                @click="selectedFilter = 'waiting'"
              >
                <span class="filters-item__title">Ожидают проверки</span>
                <img src="../../assets/icons/waiting.png"/>
                <span class="filters-item__count">{{ waitingHomeworks.length }}</span>
              </button>
              <button
                class="task__filters-item"
                :class="{'disabled': selectedFilter !== 'completed'}"
                @click="selectedFilter = 'completed'"
              >
                <span class="filters-item__title">Проверены</span>
                <img src="../../assets/icons/completed.png"/>
                <span class="filters-item__count">{{ completedHomeworks.length }}</span>
              </button>
              <button
                class="task__filters-item"
                :class="{'disabled': selectedFilter !== 'rejected'}"
                @click="selectedFilter = 'rejected'"
              >
                <span class="filters-item__title">Не сдали</span>
                <img src="../../assets/icons/rejected.png"/>
                <span class="filters-item__count">{{ rejectedHomeworks.length }}</span>
              </button>
              <button
                class="task__filters-item"
                :class="{'disabled': selectedFilter !== 'comments'}"
                @click="selectedFilter = 'comments'"
              >
                <span class="filters-item__title">Комментарии</span>
                <img class="filters-item__icon" src="../../assets/icons/comments.png" alt=""/>
                <span class="filters-item__count">{{ commentedHomeworks.length }}</span>
              </button>
            </div>
            <div class="tasks">
              <TaskCard
                v-for="homework in filteredHomeworks"
                :key="homework.id"
                class="task__item"
                :task="homework"
              />
            </div>
          </div>
        </transition>

        <div v-if="selectedHomework" class="task__footer">
          <HomeworkFilesCard
            class="card"
            :homework="selectedHomework"
            :dateEnd="new Date(task.dateEnd)"
            :withMark="!!task.withMark"
            @sendMark="sendMark"
          />
          <HomeworkCommentsCard
            class="card"
            :comments="selectedHomework.comments"
            @sendComment="sendComment"
          />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <EditTaskModal
        v-if="isEditModalOpen"
        :task="task"
        @close="isEditModalOpen = false"
        @submitModal="editTask"
      />
    </transition>
  </main>
</template>

<script>
import Teacher from '@/api/teacher';
import LessonHeader from '@/views/teacher/LessonHeader.vue';
import HomeworkCard from '@/components/homework/HomeworkCard.vue';
import EditTaskModal from '@/components/teacher/lesson/EditTaskModal.vue';
import TaskCard from '@/components/teacher/task/TaskCard.vue';
import HomeworkFilesCard from '@/components/teacher/task/HomeworkFilesCard.vue';
import HomeworkCommentsCard from '@/components/teacher/task/HomeworkCommentsCard.vue';
import Pupil from '@/api/pupil';

export default {
  name: 'Task',

  components: {
    LessonHeader,
    HomeworkCard,
    EditTaskModal,
    TaskCard,
    HomeworkFilesCard,
    HomeworkCommentsCard,
  },

  data() {
    return {
      task: null,
      isEditModalOpen: false,
      selectedFilter: 'waiting',
      waitingHomeworks: [],
      completedHomeworks: [],
      rejectedHomeworks: [],
      commentedHomeworks: [],
      selectedHomeworkId: null,
      selectedHomework: null,
    };
  },

  computed: {
    filteredHomeworks() {
      switch (this.selectedFilter) {
        case 'waiting':
          return this.waitingHomeworks;
        case 'completed':
          return this.completedHomeworks;
        case 'rejected':
          return this.rejectedHomeworks;
        case 'comments':
          return this.commentedHomeworks;
        default:
          return [];
      }
    },
  },

  watch: {
    selectedFilter() {
      setTimeout(() => {
        const el = document.querySelector('.task__filters');
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },

    $route() {
      const { homework } = this.$route.query;
      this.selectedHomeworkId = homework;
    },

    selectedHomeworkId() {
      this.selectedHomework = null;
      if (this.selectedHomeworkId) {
        this.getHomework()
          .then(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          });
      } else {
        this.getTask()
          .then(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          });
      }
    },
  },

  created() {
    this.getTask();
    this.selectedHomeworkId = this.$route.query.homework;
  },

  methods: {
    async getTask() {
      try {
        const taskId = this.$route.params.id;
        const response = await Teacher.getTask(taskId);
        this.task = response.data;

        this.waitingHomeworks = this.task.homeworks
          .filter((homework) => !homework.isApproved && homework.date);

        this.completedHomeworks = this.task.homeworks
          .filter((homework) => homework.isApproved);

        this.rejectedHomeworks = this.task.homeworks
          .filter((homework) => !homework.date && !homework.isApproved);

        this.commentedHomeworks = this.task.homeworks
          .filter((homework) => homework.isNewComments);
      } catch {
        await this.$router.replace('/page-not-found');
      }
    },

    async editTask(task) {
      await Teacher.editTask(task.id, task);
      await this.getTask();
      this.isEditModalOpen = false;
    },

    async getHomework() {
      try {
        const response = await Teacher.getHomework(this.selectedHomeworkId);
        this.selectedHomework = response.data;
      } catch {
        await this.$router.replace('/page-not-found');
      }
    },

    async sendComment(comment) {
      const homeworkId = this.selectedHomework.id;

      await Pupil.sendComment(homeworkId, comment);
      await this.getHomework();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    },

    async sendMark(mark) {
      const homeworkId = this.selectedHomework.id;
      const data = {
        mark,
      };
      await Teacher.sendMark(homeworkId, data);
      await this.getHomework();
    },
  },
};
</script>

<style lang="scss" scoped>
.task {
  overflow: hidden;
  background-color: #fff;
  border-radius: 25px;
  max-width: 1200px;
  padding: 0 0 20px;
  margin-right: 20px;
  width: 100%;

  .task__body {
    padding: 0 40px;

    @media (max-width: 500px) {
      padding: 0 2px;
    }
  }

  .task__footer {
    margin-top: 20px;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;

    @media (max-width: 1250px) {
      flex-direction: column;
      align-items: center;

      .card {
        margin-top: 20px;
      }
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

.tasks {
  padding: 0 40px;
  margin-top: 20px;

  .task__item {
    margin-top: 10px;
  }
}
.main{
  display: flex;
  justify-content: center;
}
</style>
