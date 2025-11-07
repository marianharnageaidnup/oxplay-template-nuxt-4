export interface ReCaptcha {
  execute: (action: string) => Promise<string>;
  reset: () => void;
}

declare module '#app' {
  interface NuxtApp {
    $recaptcha: ReCaptcha;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $recaptcha: ReCaptcha;
  }
}

export {};
