<template>
  <div
    class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
  >
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
      ></div>
      <div
        class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
      >
        <div class="max-w-md mx-auto">
          <div class="text-center">
            <h1 class="text-3xl font-extrabold text-gray-900">SoundScribe</h1>
            <p class="mt-2 text-sm text-gray-500">
              Vue 3 + TypeScript + Tailwind CSS + Electron
            </p>
          </div>
          <div class="mt-8 space-y-6">
            <button @click="sendMessage" class="btn w-full">
              Electronメッセージを送信
            </button>
            <div v-if="receivedMessage" class="p-4 bg-gray-100 rounded-md">
              <p class="text-sm font-medium text-gray-800">
                受信したメッセージ:
              </p>
              <p class="mt-1 text-sm text-gray-600">{{ receivedMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    const receivedMessage = ref<string>("");
    let cleanup: (() => void) | null = null;

    onMounted(() => {
      // Electronからのメッセージを受信する
      if (window.electronAPI) {
        cleanup = window.electronAPI.onReceiveMessage((message: any) => {
          receivedMessage.value = message;
        });
      }
    });

    onUnmounted(() => {
      // リスナーをクリーンアップ
      if (cleanup) {
        cleanup();
      }
    });

    const sendMessage = () => {
      if (window.electronAPI) {
        window.electronAPI.sendMessage("こんにちは、Electron!");
        // メインプロセスからの応答は onReceiveMessage で処理
      }
    };

    return {
      receivedMessage,
      sendMessage,
    };
  },
});
</script>
