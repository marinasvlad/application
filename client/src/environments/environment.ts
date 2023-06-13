// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api/',
  googleOauthUrl: 'https://accounts.google.com/o/oauth2/v2/auth?scope=email&include_granted_scopes=true&redirect_uri=https://localhost:5001/api/account/logingoogle&response_type=code&client_id=931211722163-k4v30mh5k87a0le5m4bh71h38rq010v4.apps.googleusercontent.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
