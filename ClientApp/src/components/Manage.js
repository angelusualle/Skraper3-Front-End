import React, { Component } from 'react';

export class Manage extends Component {
  displayName = Manage.name

  constructor(props) {
    super(props);
    var authenticated = false;
    var email = '';
    if (localStorage.getItem("Skraper3Email") !== null){
      authenticated = true;
      email= localStorage.getItem("Skraper3Email");
    }
    this.state = { subscriptions: [], loading: true, email: email, authenticated:authenticated };
  }

  componentDidMount() {
    if (this.state.email !== ''){
      
    }
  }

  static renderForecastsTable(forecasts) {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.dateFormatted}>
              <td>{forecast.dateFormatted}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Manage.renderForecastsTable(this.state.forecasts);

    return (
      <div>
        {this.state.authenticated ? 
        <h1>Your subscriptions:</h1>
        :
        <h1>Enter your email to manage your subscriptions:</h1>
        
      }
      </div>
    );
  }
}
