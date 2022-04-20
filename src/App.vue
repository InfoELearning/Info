<template>
  <router-view/>
</template>

<style lang="scss">
@import "~@/assets/styles/reset.css";
@import "~@/assets/styles/mark.scss";

body {
  background: #EAF3FA;
  height: 100vh !important;

  &.m--burger {
    main {
      @media (min-width: 800px) {
        margin-left: 320px;
      }
    }

    .modal {
      @media (min-width: 800px) {
        padding-left: 200px;
      }
    }
  }
}

main {
  transition: margin-left 0.3s ease-out;
  margin-left: 90px;
  margin-top: 50px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 999;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(196, 196, 196, 0.5);
  font-size: 27px;

  &.show {
    display: block;
  }
}

.modal-content {
  margin: auto;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  background: #FFFFFF;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 35px;
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 28px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.fade-enter-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
