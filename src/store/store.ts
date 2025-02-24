import { defineStore } from 'pinia';
import { createClient, MatrixClient, Room, type EmittedEvents, SyncState } from 'matrix-js-sdk';

interface MatrixState {
  client: MatrixClient | null;
  rooms: Room[];
  accessToken: string | null;
  homeserver: string | null;
  userId: string | null;
  isLoading: boolean;
}

export const useMatrixStore = defineStore('matrix', {
  state: (): MatrixState => ({
    client: null,
    rooms: [],
    accessToken: localStorage.getItem('matrix_access_token') || null,
    homeserver: localStorage.getItem('matrix_homeserver') || null,
    userId: localStorage.getItem('matrix_user_id') || null,
    isLoading: false
  }),

  actions: {
    async login(homeserver: string, username: string, password: string): Promise<void> {
      this.isLoading = true
      try {
        const client = createClient({ baseUrl: homeserver });
        const response = await client.login("m.login.password", {
          identifier: { type: "m.id.user", user: username },
          password: password,
          initial_device_display_name: "My App",
        });

        client.setAccessToken(response.access_token);
        this.client = client;

        this.accessToken = response.access_token;
        this.homeserver = homeserver;
        this.userId = response.user_id;

        localStorage.setItem('matrix_access_token', response.access_token);
        localStorage.setItem('matrix_homeserver', homeserver);
        localStorage.setItem('matrix_user_id', response.user_id);

        await this.startAndSyncClient();
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        this.isLoading = false
      }
    },

    async restoreSession(): Promise<void> {
      if (!this.accessToken || !this.homeserver || !this.userId) return;

      try {
        const client = createClient({
          baseUrl: this.homeserver,
          accessToken: this.accessToken,
          userId: this.userId,
        });

        this.client = client;
        await this.startAndSyncClient();
        console.log("Session restored");
      } catch (error) {
        console.error("Session restore failed:", error);
        this.logout();
      }
    },

    async startAndSyncClient(): Promise<void> {
      if (!this.client) return;
    
      this.client.startClient({
        initialSyncLimit: 10,
      });
    
      this.rooms = this.client.getRooms();
    
      this.client.on("sync" as EmittedEvents, (state: SyncState) => {
        if (state === "SYNCING" || state === "PREPARED") {
          this.fetchRooms();
        }
      });
    
      this.client.on("Room" as EmittedEvents, () => {
        this.fetchRooms();
      });
    
      await new Promise<void>((resolve) => {
        this.client!.once("sync" as EmittedEvents, (state: SyncState) => {
          if (state === "PREPARED") resolve();
        });
      });
    
      this.fetchRooms();
    },    

    logout(): void {
      if (this.client) {
        this.client.stopClient();
        this.client = null;
      }
      this.accessToken = null;
      this.homeserver = null;
      this.userId = null;
      this.rooms = [];

      localStorage.removeItem('matrix_access_token');
      localStorage.removeItem('matrix_homeserver');
      localStorage.removeItem('matrix_user_id');
    },

    async fetchRooms(): Promise<void> {
      if (!this.client) return;
      this.rooms = this.client.getRooms();
    }
  }
});
