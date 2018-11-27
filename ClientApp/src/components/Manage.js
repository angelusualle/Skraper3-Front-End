import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Alert, Table, Form, Glyphicon} from 'react-bootstrap';
import validator from "validator";

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
    this.state = { subscriptions: [], loading: false, emailSub: email, authenticated:authenticated, invalid:true, isFailure:false, loadingSubs:true};
  }

  componentDidMount() {
    let email = '';
    if (localStorage.getItem("Skraper3Email") !== null){
      email= localStorage.getItem("Skraper3Email");
      this.setState({loadingSubs:true});
      fetch(`api/Subscription/GetSubs?email=${encodeURIComponent(email)}`).then((response) => {
        if (response.ok) return response.json().then((t) => {
          this.setState({authenticated:true, loading:false, loadingSubs:false, subscriptions: t})
        });
        else response.text()
          .then(text => {throw Error(text)})
          .catch((e) => {
            this.setState({failureMessage: e.message, isFailure: true, loadingSubs:false, loading: false, authenticated:false});
          })
      })
      .catch((e) => {
        this.setState({failureMessage: e.message, isFailure: true, loadingSubs:false, loading: false, authenticated:false});
      });
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

  logout(e){
    localStorage.removeItem("Skraper3Email");
    this.setState({ subscriptions: [], loading: false, emailSub: '', authenticated:false, invalid:false, isFailure:false, loadingSubs:true})
  }
  checkSubscriptions(ex){
    ex.preventDefault();
    this.setState({loading:true});
    fetch(`api/Subscription/GetSubs?email=${encodeURIComponent(this.state.emailSub)}`).then((response) => {
      if (response.ok) return response.json().then((t) => {
        this.setState({authenticated:true, loading:false, loadingSubs:false, subscriptions: t})
        localStorage.setItem("Skraper3Email", this.state.emailSub);
      });
      else response.text()
        .then(text => {throw Error(text)})
        .catch((e) => {
          this.setState({failureMessage: e.message, isFailure: true, loadingSubs:false, loading:false});
        })
    })
    .catch((e) => {
      this.setState({failureMessage: e.message, isFailure: true, loadingSubs:false, loading: false});
    });

  }

  render() {
    return (
      <div>
        {this.state.authenticated ? 
        <div>
          <h1>Subscriptions</h1>
          <p>{this.state.emailSub}</p>
          {this.state.loadingSubs ? 'loading...' :
          <div>
            <Table responsive striped bordered condensed hover>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Mobile Number</th>
                  <th>XPath</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.subscriptions.map(sub =>
                  <tr key={sub.email + sub.url}>
                    <td>{sub.url}</td>
                    <td>{sub.mobileNumber}</td>
                    <td>{sub.xpath}</td>
                    <td>x</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Button 
            bsStyle="primary" 
            bsSize="large" 
            onClick={(e) => this.logout(e)}
            >
            <Glyphicon glyph='log-out' />   Log out
            </Button>
          </div>
          }
        </div>
        :
        <div>
          <h3>Enter your email to manage your subscriptions:</h3>
          <Form onSubmit={((e) => this.checkSubscriptions(e))}>
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
                type="submit"
                disabled={this.state.invalid || this.state.loading}
              >
              {this.state.loading && 'Loading Subscriptions...'}
                {!this.state.loading && 'See your subscriptions'}
              </Button>
              <br></br>
              <br></br>
              {this.state.isFailure &&
            <Alert bsStyle="danger" >
              {this.state.failureMessage}
            </Alert>}
          </Form>
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
