import HTTP from './default';

export default {
  getLessons() {
    return HTTP({
      url: '/pupil/lessons',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  getLesson(lessonId) {
    return HTTP({
      url: `/pupil/lesson/${lessonId}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  getTasks(lessonId) {
    return HTTP({
      url: `/pupil/tasks/${lessonId}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  getTask(taskId) {
    return HTTP({
      url: `/pupil/task/${taskId}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  sendHomework(homeworkId, homework) {
    return HTTP({
      url: `/pupil/homework/${homeworkId}`,
      method: 'PATCH',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data: homework,
    });
  },

  sendComment(homeworkId, comment) {
    return HTTP({
      url: `/pupil/homework/${homeworkId}/comments`,
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data: comment,
    });
  },

  getJournal() {
    return HTTP({
      url: '/pupil/journal',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  getTimetable() {
    return HTTP({
      url: '/pupil/timetable',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },
};
