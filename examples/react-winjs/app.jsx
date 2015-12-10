import React from 'react';
import ReactDOM from 'react-dom';
import WinJS from 'npm:winjs';
import 'npm:winjs/css/ui-dark.css!';
import { BackButton } from 'react-winjs';

import WinJSBrowserHistory from './WinJSBrowserHistory.js';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.winJSBrowserHistory = new WinJSBrowserHistory(this.onApplyNavigaitonChange.bind(this), this.onNavigationError.bind(this));

        this.state = {
            nav: {
                state: WinJS.Navigation.state,
                location: WinJS.Navigation.location,
            },
            replaceHistoryStateValue: 0
        }
    }

    componentWillMount () {
        console.log("componentWillMount");
        this.winJSBrowserHistory.initFirstNavigation();
    }

    onApplyNavigaitonChange(location, state) {

        if(location === "/causeError") {
          throw new Error("test navigation error");
        }

        console.log("app.jsx: onApplyNavigaitonChange(location, state)", location, state);
        this.setState({
            nav: {
                location: location,
                state: state
            }
        });
    }

    onNavigationError(err) {
      console.error("app.jsx: onNavigationError: ", err);
      alert(err);
    }

    gotoPage1Nested() {
        WinJS.Navigation.navigate("/page1/nested");
    }

    gotoPage1() {
        WinJS.Navigation.navigate("/page1");
    }

    gotoNagivationErrorTest() {
        WinJS.Navigation.navigate("/causeError");
    }

    replaceHistoryState() {

        this.setState({
            replaceHistoryStateValue: ++this.state.replaceHistoryStateValue
        }, () => {
            window.history.replaceState(null, "replace state title", "#/replaceHistoryTest/" + this.state.replaceHistoryStateValue);
        });
    }

    gotoReplaceHistoryTest() {
      WinJS.Navigation.navigate("/replaceHistoryTest");
    }

    render() {

        console.log("render() location:", this.state.nav.location);

        var componentWithBackButton = component => {
            return (
                <div>
                    <BackButton />
                    <div>
                        {component}
                    </div>
                </div>
            );
        };

        var page;

        switch(this.state.nav.location) {

            case "/replaceHistoryTest":
                page = componentWithBackButton(<div>
                    window.history.replaceState test - <button type="button" onClick={this.replaceHistoryState.bind(this)}>Increment replace-state {this.state.replaceHistoryStateValue}</button>
                </div>);
            break;

            case "/page1":
                page = componentWithBackButton(<div>
                    Page 1 - <button type="button" onClick={this.gotoPage1Nested.bind(this)}>Goto Page 2 (nested)</button>

                  <button type="button" onClick={this.gotoNagivationErrorTest.bind(this)}>Sample error on navigation</button>
                </div>);
            break;

            case "/page1/nested":
                page = componentWithBackButton(<div>Page 2</div>);
            break;

            default:
                page = (<div>
                  <button type="button" onClick={this.gotoPage1.bind(this)}>Goto Page 1</button>

                  <button type="button" onClick={this.gotoReplaceHistoryTest.bind(this)}>Replace History Test</button>
                </div>);
        }

        return page;
    }
}

ReactDOM.render(<App />, document.getElementById('main'));
