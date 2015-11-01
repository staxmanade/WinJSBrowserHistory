import React from 'react';
import ReactDOM from 'react-dom';
import WinJS from 'npm:winjs';
import 'npm:winjs/css/ui-dark.css!';
import { BackButton } from 'react-winjs';

import WinJSBrowserHistory from './WinJSBrowserHistory.js';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.winJSBrowserHistory = new WinJSBrowserHistory(this.onApplyNavigaitonChange.bind(this));

        this.state = {
            nav: {
                state: WinJS.Navigation.state,
                location: WinJS.Navigation.location
            }
        }
    }

    componentWillMount () {
        console.log("componentWillMount");
        this.winJSBrowserHistory.initFirstNavigation();
    }

    onApplyNavigaitonChange(location, state) {
        this.setState({
            nav: {
                location: location,
                state: state
            }
        });
    }

    gotoPage1Nested() {
        WinJS.Navigation.navigate("/page1/nested");
    }

    gotoPage1() {
        WinJS.Navigation.navigate("/page1");
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
            case "/page1":
                page = componentWithBackButton(<div>
                    Page 1 - <button type="button" onClick={this.gotoPage1Nested.bind(this)}>Goto Page 2 (nested)</button>
                </div>);
            break;

            case "/page1/nested":
                page = componentWithBackButton(<div>Page 2</div>);
            break;

            default:
                page = (<div>
                    <button type="button" onClick={this.gotoPage1.bind(this)}>Goto Page 1</button>
                </div>);
        }

        return page;
    }
}

ReactDOM.render(<App />, document.getElementById('main'));
