export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const siteKey = (config.public.recaptcha as { siteKey: string }).siteKey;

  let widgetId: number | null = null;
  let scriptLoaded = false;

  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (scriptLoaded && window.grecaptcha) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src*="google.com/recaptcha/api.js"]');

      if (existingScript) {
        if (window.grecaptcha) {
          scriptLoaded = true;
          resolve();
        } else {
          existingScript.addEventListener('load', () => {
            scriptLoaded = true;
            resolve();
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load reCAPTCHA script'));
      };

      document.head.appendChild(script);
    });
  };

  const recaptcha = {
    execute: (action: string): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        try {
          await loadScript();

          if (!window.grecaptcha) {
            reject(new Error('reCAPTCHA not loaded'));
            return;
          }

          window.grecaptcha.ready(() => {
            try {
              let container = document.getElementById('recaptcha-container');
              if (!container) {
                container = document.createElement('div');
                container.id = 'recaptcha-container';
                document.body.appendChild(container);
              }

              if (widgetId === null) {
                try {
                  widgetId = window.grecaptcha.render('recaptcha-container', {
                    sitekey: siteKey,
                    size: 'invisible',
                    callback: (token: string) => {
                      console.log('reCAPTCHA token received:', token);
                      resolve(token);
                    },
                    'error-callback': () => {
                      reject(
                        new Error(
                          'reCAPTCHA verification failed. Check if the site key is valid and the domain is authorized.'
                        )
                      );
                    },
                    'expired-callback': () => {
                      reject(new Error('reCAPTCHA verification expired'));
                    },
                  });
                } catch (renderError) {
                  reject(renderError);
                  return;
                }
              } else {
                console.log('Widget already exists with ID:', widgetId);
              }

              try {
                window.grecaptcha.execute(widgetId);
              } catch (executeError) {
                console.error('Error executing widget:', executeError);
                reject(executeError);
              }
            } catch (error) {
              console.error('Error in grecaptcha.ready callback:', error);
              reject(error);
            }
          });
        } catch (error) {
          console.error('reCAPTCHA execute error:', error);
          reject(error);
        }
      });
    },
    reset: () => {
      if (widgetId !== null && window.grecaptcha) {
        console.log('Resetting reCAPTCHA widget');
        window.grecaptcha.reset(widgetId);
      }
    },
  };

  return {
    provide: {
      recaptcha,
    },
  };
});

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (
        container: string | HTMLElement,
        parameters: {
          sitekey: string;
          size?: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        }
      ) => number;
      execute: (widgetId: number) => void;
      reset: (widgetId: number) => void;
    };
  }
}
