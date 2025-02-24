<template>
  <div>
    <h2>Chats</h2>
    <ul>
      <li v-for="room in sortedRooms" :key="room.roomId">
        {{ room.name }} - {{ resolveMessages(room) }}
      </li>
    </ul>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useMatrixStore } from '@/store/store';
import { useRouter } from 'vue-router';
import { Room } from 'matrix-js-sdk';

const matrixStore = useMatrixStore();
const router = useRouter();

onMounted(() => {
  matrixStore.fetchRooms();
});

const sortedRooms = computed(() => {
  const rooms = matrixStore.rooms as Room[];
  return [...rooms.sort((a: Room, b: Room) => {
    const lastEventA = a.timeline[0]?.event.origin_server_ts || 0;
    const lastEventB = b.timeline[0]?.event.origin_server_ts || 0;
    
    if (lastEventA !== lastEventB) {
      return lastEventB - lastEventA;
    }
    
    return a.name.localeCompare(b.name);
  })];
});

const resolveMessages = (room: Room) => {
  const lastEvent = room.timeline[room.timeline.length - 1]?.event?.content?.body;
  return lastEvent ?? 'No messages';
};



const logout = () => {
  matrixStore.logout();
  router.push('/');
};
</script>