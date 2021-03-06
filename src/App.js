import React, { Component } from "react";
import Header from "./views/Header";
import AppRouter from "./components/shared/routers/AppRouter";

import ReactNotifications from 'react-notifications-component';

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 */
class App extends Component {
  render() {
    return (
      <div>
          {/* <Header height={"100"} /> */}
          <ReactNotifications />
        <AppRouter />
      </div>
    );
  }
}

export default App;
