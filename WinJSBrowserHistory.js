import WinJS from 'winjs';

var debugLog = (...args) => {
    console.log('WinJSBrowserHistory:', ...args);
}

export default class WinJSBrowserHistory {

    constructor(onApplyNavigaitonChange) {

        this.debug = true;

        if(typeof onApplyNavigaitonChange !== "function") {
            throw new Error("Expecting first argumet to be a function that can take 2 parametes (location: string, state: any) => {}");
        }

        this._isNavigationBeingHandled = false;
        this._isWinJSNavigationBackBeingHandled = false;
        this._isNavigationTriggeredByPopStateEvent = false;

        this.onApplyNavigaitonChange = onApplyNavigaitonChange;

        WinJS.Navigation.addEventListener("beforenavigate", this.handleBeforeNavigate.bind(this));
        WinJS.Navigation.addEventListener("navigating", this.handleNavigating.bind(this));
        WinJS.Navigation.addEventListener("navigated", this.handleNavigated.bind(this));
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }

    // This cleanup() generally isn't called as this object usually lives as a singleton on the page
    // but if youneed to remove it, be sure to call this so we clean up event handlers.
    cleanup() {
      this.debug && debugLog("cleanup()");
      WinJS.Navigation.removeEventListener("beforenavigate", this.handleBeforeNavigate);
      WinJS.Navigation.removeEventListener("navigating", this.handleNavigating);
      WinJS.Navigation.removeEventListener("navigated", this.handleNavigated);
    }

    initFirstNavigation() {
      WinJS.Navigation.navigate(this.getHashLessUrl(), location.state);
    }

    getHashLessUrl() {
      var hash = location.hash || '';
      if(hash[0] === "#") {
          hash = hash.slice(1)
      }
      return hash;
    }

    handlePopState(eventObject) {
        this.debug && debugLog("handlePopState:", eventObject, eventObject.path, eventObject.state);
        if(!this._isNavigationBeingHandled && !this._isWinJSNavigationBackBeingHandled) {
            this._isNavigationTriggeredByPopStateEvent = true;


            this._isPopStateTriggeredEvent = true;

            WinJS.Navigation.navigate(this.getHashLessUrl(), location.state);
        }
        this._isWinJSNavigationBackBeingHandled = false;
    }

    handleBeforeNavigate(eventObject) {
        this._isNavigationBeingHandled = true;
        this.debug && debugLog("handleBeforeNavigate:", eventObject);
    }

    handleNavigating(eventObject) {
        this.debug && debugLog("handleNavigating:", eventObject);
        this.debug && debugLog("handleNavigating delta:", eventObject.detail.delta);

        var location = eventObject.detail.location;
        var state = eventObject.detail.state;
        var delta = eventObject.detail.delta;

        this.onApplyNavigaitonChange(location, state);

        if(!this._isNavigationTriggeredByPopStateEvent) {
            if(delta < 0) {
                this.debug && debugLog("handleNavigating delta < 0 - going back");

                this._isWinJSNavigationBackBeingHandled = true;
                window.history.go(delta);
            } else {
                this.debug && debugLog("handleNavigating history.pushState()", "#" + location);
                window.history.pushState(state, "", "#" + location);
            }
        }
    }

    handleNavigated(eventObject) {
        this._isNavigationBeingHandled = false;
        this._isNavigationTriggeredByPopStateEvent = false;


        this.debug && debugLog("handleNavigated", eventObject);
    }

}
