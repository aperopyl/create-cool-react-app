import React from "react";

import styles from "./App.scss";

class App extends React.Component {
    state = {
        index: 0
    };

    phrases = [
        "Welcome to React!",
        "App created by create-cool-react-app!",
        "Get started now!"
    ];

    componentDidMount() {
        this.rotation = setInterval(
            () => {
                this.setState(({ index }) => ({
                    index: (index + 1) % this.phrases.length
                }));
            },
            2000
        );
    }

    componentWillUnmount() {
        clearInterval(this.rotation);
    }

    render() {
        const { index } = this.state;

        return (
            <div>
                <header>
                    <img
                        className={ styles.react }
                        src="/assets/react.svg"
                        alt="React" />
                </header>
                <main className={ styles.welcome }>
                    { this.phrases[index] }
                </main>
                <footer>
                    The React logo is property of Facebook, Inc.
                </footer>
            </div>
        );
    }
}

export default App;
