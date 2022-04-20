import HTTP from './default';

export default {
  getLessons() {
    return HTTP({
      url: '/teacher/lessons',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  createLesson(data) {
    return HTTP({
      url: '/lessons',
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data,
    });
  },

  editLesson(id, data) {
    return HTTP({
      url: `/lessons/${id}`,
      method: 'PATCH',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data,
    });
  },

  getTasks(lessonId) {
    return HTTP({
      url: `/teacher/tasks/${lessonId}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  createTask(data) {
    return HTTP({
      url: '/tasks',
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data,
    });
  },

  editTask(taskId, data) {
    return HTTP({
      url: `/tasks/${taskId}`,
      method: 'PATCH',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data,
    });
  },

  getTask(taskId) {
    return HTTP({
      url: `/teacher/task/${taskId}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  getHomework(homeworkId) {
    return HTTP({
      url: `/teacher/homework/${homeworkId}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },

  sendMark(homeworkId, data) {
    return HTTP({
      url: `/teacher/homework/${homeworkId}/mark`,
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data,
    });
  },

  getTimetable() {
    return HTTP({
      url: '/teacher/timetable',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },
  getPupils(idSchool, idClass) {
    return HTTP({
      url: `/teacher/pupils/${idSchool}/${idClass}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },
};
