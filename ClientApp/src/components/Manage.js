import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Alert } from 'react-bootstrap';
import validator from "validator"

export class Manage extends Component {
  displayName = Manage.name

  constructor(props) {
    super(props);
    let authenticated = false;
    let email = '';
    if (localStorage.getItem("Skraper3Email") !== null){
      authenticated = true;
      email= localStorage.getItem("Skraper3Email");
    }
    this.state = { subscriptions: [], loading: true, emailSub: email, authenticated:authenticated, invalid:true, isFailure:false};
  }

  componentDidMount() {
    if (this.state.emailSub !== ''){
      
    }
  }

  handleChange(id, val) {
    let valid = validator.isEmail(val);
    this.setState({[id]:val, invalid:!valid, isFailure: false});
  }

  checkValidity(){
    if (this.getValidationStateEmail() === 'success'){
      return true;
    }
    return false;
  }
  getValidationStateEmail(){
    if (this.state.emailSub.length === 0|| this.state.isLoading) return null;
    if (validator.isEmail(this.state.emailSub)) return 'success';
    return 'error'
  }

  checkSubscriptions(){
    fetch(`api/Subscription/GetSubs?email=${encodeURIComponent(this.state.emailSub)}`).then((response) => {
      if (response.ok) return response.json().then((t) => this.setState({authenticated:true, loading:false, subscriptions: t}));
      else response.text().then(text => {throw Error(text)}).catch((e) => {
        this.setState({failureMessage: e.message, isFailure: true, loading:false})})
    })
    .catch((e) => {
      this.setState({failureMessage: e.message, isFailure: true, loading: false})}
    );
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
    return (
      <div>
        {this.state.authenticated ? 
        <div>
          <h1>Your subscriptions:</h1>
          {this.renderForecastsTable()}
        </div>
        :
        <div>
          <h3>Enter your email to manage your subscriptions:</h3>
          <FieldGroup
              id="emailSub"
              name="Email"
              type="email"
              required
              label="Email"
              onChange={(e) => this.handleChange(e.target.id, e.target.value)}
              value={this.state.emailSub}
              disabled={this.state.isLoading}
              help="Example: YourEmail@Domain.com"
              validationState={this.getValidationStateEmail()}
            />
            <Button 
              bsStyle="primary" 
              bsSize="large" 
              disabled={this.state.invalid} 
              onClick={(e) => this.checkSubscriptions(e)}
            >
            See your subscriptions
            </Button>
            <br></br>
            <br></br>
            {this.state.isFailure &&
          <Alert bsStyle="danger" >
            {this.state.failureMessage}
          </Alert>}
        </div>
      }
      </div>
    );
  }
}
function FieldGroup({ id, label, help, validationState, ...props }) {
  return (
    <FormGroup controlId={id} validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props}/>
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}
