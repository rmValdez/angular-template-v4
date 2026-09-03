// Local dev defaults — swapped in for `environment.ts` by `ng serve` /
// `ng build --configuration development` (see angular.json fileReplacements).
export const environment = {
  production: false,
  // nuxt-template-v2, the shared local auth backend for this template and
  // vue-template-v3.
  apiBaseUrl: 'http://localhost:3000/api',
};
