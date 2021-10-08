import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  // NB: placeholder preciso che viene utilizzato da post-build.js per rimpiazzare il valore
//   private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  private currentMainHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  private currentScriptsHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  private currentInlineHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  private currentPolyfillsHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  private currentStylesHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private http: HttpClient) {}
  /**
   * Checks in every set frequency the version of frontend application
   * @param url
   * @param {number} frequency - in milliseconds, defaults to 30 minutes
   */

  private UN_SECONDO = 1000;
  private UN_MINUTO = 1000 * 60;

  public initVersionCheck(url, frequency = 1 * this.UN_MINUTO) {
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
    this.checkVersion(url);
  }
  /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
  private checkVersion(url) {
    // timestamp these requests to invalidate caches
    this.http.get(url + '?t=' + new Date().getTime()).subscribe(
      response => {

        const mainHash = response['main'];
        const scriptsHash = response['scripts'];
        const inlineHash = response['inline'];
        const polyfillsHash = response['polyfills'];
        // const stylesHash = response.styles;

        // const msgMain = `[main] salvato: ${this.currentMainHash} - version.json: ${mainHash}`;
        // const msgScripts = `[scripts] salvato: ${this.currentScriptsHash} - version.json: ${scriptsHash}`;
        // const msgInline = `[inline] salvato: ${this.currentInlineHash} - version.json: ${inlineHash}`;
        // const msgPolyfills = `[polyfills] salvato: ${this.currentPolyfillsHash} - version.json: ${polyfillsHash}`;
        // const msgStyles = `[styles] salvato: ${this.currentStylesHash} - version.json: ${stylesHash}`;

        // console.log(msgMain);
        // console.log(msgScripts);
        // console.log(msgInline);
        // console.log(msgPolyfills);

        // console.log(msgStyles);

        const hashChanged = (
          this.hasHashChanged(this.currentMainHash, mainHash)
          || this.hasHashChanged(this.currentScriptsHash, scriptsHash)
          || this.hasHashChanged(this.currentInlineHash, inlineHash)
          || this.hasHashChanged(this.currentPolyfillsHash, polyfillsHash)
          // || this.hasHashChanged(this.currentStylesHash, stylesHash)
        );

        console.log(`Controllo versione sorgenti FE`);

        // If new version, do something
        if (hashChanged) {
          window.location.reload(true); // con true non carica dalla cache
        }

        // store the new hash so we wouldn't trigger versionChange again
        // only necessary in case you did not force refresh
        this.currentMainHash = mainHash;
        this.currentScriptsHash = scriptsHash;
        this.currentInlineHash = inlineHash;
        this.currentPolyfillsHash = polyfillsHash;
      },
      err => {
        console.error(err, 'Could not get version');
      }
    );
  }
  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }
    return currentHash !== newHash;
  }
}
