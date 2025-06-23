import Groups from './components/Groups.vue';
// import SignUp from './components/SignUp.vue';
import GroupChat from './components/GroupChat.vue';
import DashBoard from './components/DashBoard.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue'
import Friends from './components/Friends.vue'

// import Login from './components/Login.vue';

const routes = [
    {
        name: 'DashBoard',
        component: DashBoard,
        path: '/',
    },
    {
        name: 'SignUp',
        component: SignUp,
        path: '/sign-up',
    },
    {
        name: 'Login',
        component: Login,
        path: '/login',
    },
    {
        name: 'Groups',
        component: Groups,
        path: '/group-list',
    },
    {
        name: 'GroupChat',
        component: GroupChat,
        path: '/group-chat/:id',
    },
    {
        name: 'Friends',
        component: Friends,
        path: '/friends',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;