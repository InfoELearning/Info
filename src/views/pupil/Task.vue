<template>
  <main>
    <transition name="fade">
      <div v-if="task" class="task">
        <LessonHeader :lesson="task.lesson"/>
        <div class="task__body">
          <HomeworkCard :task="task" :editable="false"/>
        </div>
        <div class="task__footer">
          <UserFilesCard
            class="card"
            :homework="task.homework"
            :files="task.homework.materials"
            :dateEnd="new Date(task.dateEnd)"
            :withMark="!!task.withMark"
            @sendHomework="sendHomework"
          />
          <CommentsCard
            class="card"
            :comments="task.comments"
            @sendComment="sendComment"
          />
        </div>
      </div>
    </transition>
  </main>
</template>

<script>
import Pupil from '@/api/pupil';
import LessonHeader from '@/views/teacher/LessonHeader.vue';
import HomeworkCard from '@/components/homework/HomeworkCard.vue';
import UserFilesCard from '@/components/homework/UserFilesCard.vue';
import CommentsCard from '@/components/homework/CommentsCard.vue';

export default {
  name: 'Task',

  components: {
    LessonHeader,
    HomeworkCard,
    UserFilesCard,
    CommentsCard,
  },

  data() {
    return {
      task: null,
      isEditModalOpen: false,
    };
  },

  created() {
    this.getTask();
  },

  methods: {
    async getTask() {
      const taskId = this.$route.params.id;
      const response = await Pupil.getTask(taskId);
      this.task = response.data;
    },

    async sendHomework(homework) {
      const homeworkId = this.task.homework.id;
      await Pupil.sendHomework(homeworkId, homework);
      await this.getTask();
    },

    async sendComment(comment) {
      const homeworkId = this.task.homework.id;

      await Pupil.sendComment(homeworkId, comment);
      await this.getTask();
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
    margin-top: 20px;
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
.main{
  display: flex;
  justify-content: center;
}
</style>
