import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Panel, Button, Alert, Form } from 'react-bootstrap';
import './Home.css';
import validator from "validator"

export class Home extends Component {
  displayName = Home.name
  state = {
    URL: '',
    Email: '',
    MobileNumber: '',
    XPath: '',
    isLoading: false,
    invalid: true,
    successMessage: '',
    isSubbed: false,
    failureMessage: '',
    isFailure: false,
    invalidMessage: '',
  }

  
  reset(e){
    window.location.reload();
  }

  handleChange(id, val) {
    var valid = this.checkValidity();
    this.setState({[id]:val, invalid:!valid})
  }

  checkValidity(){
    if (this.getValidationStateEmail() === 'success' && this.getValidationStateURL() === 'success'){
      return true;
    }
    return false;
  }

  getValidationStateURL(){
    if (this.state.URL.length === 0 || this.state.isLoading || this.state.isSubbed) return null;
    if (validator.isURL(this.state.URL)) return 'success';
    return 'error'
  }

  getValidationStateEmail(){
    if (this.state.Email.length === 0|| this.state.isLoading || this.state.isSubbed) return null;
    if (validator.isEmail(this.state.Email)) return 'success';
    return 'error'
  }

  handleSub(e){
    e.preventDefault()

    this.setState({isLoading:true});
    fetch('api/Subscription/Add', {
          method:'POST',
          body: JSON.stringify(this.state),
          headers:{'Content-Type': 'application/json;charset=UTF-8'}
        })
        .then((response) => {
          response.text().then((t) => this.setState({successMessage: t, isSubbed: true, isLoading: false}));
        })
        .catch((e) => this.setState({failureMessage: e.message, isFailure: true}));
  }

  render() {
    return (
      <div>
        <h3>Welcome to Skraper3</h3>
        <h4>It watches websites and lets you know when they change.</h4>
        <p>To subscribe to a website, fill form at bottom of this page using its URL, your email and optional phone number to get alerted when the site changes.</p>
        <h3>XPath</h3>
        <p>There is also an optional XPath parameter that 
          can be used to specify if only part of a website should be watched. Please see below links to test your XPath:</p>
        <a href="http://benibela.de/documentation/internettools/xquery.TXQueryEngine.html">HTML XPath Guide</a>
        <br/>
        <a href="http://videlibri.sourceforge.net/cgi-bin/xidelcgi">HTML XPath Testing Site</a>
        <br/>
        <br/>
        <Panel>
          <Form onSubmit= {(e) => this.handleSub(e)} onReset={(e) => this.reset(e)}>
            <FieldGroup
              id="URL"
              name="URL"
              type="text"
              required
              label="*URL"
              onChange={(e) => this.handleChange(e.target.id, e.target.value)}
              disabled={this.state.isSubbed || this.state.isLoading}
              help="Example: http://www.google.com/search"
              validationState={this.getValidationStateURL()}
            />
            <FieldGroup
              id="Email"
              name="Email"
              type="email"
              required
              label="*Email"
              validationState={this.getValidationStateEmail()}
              onChange={(e) => this.handleChange(e.target.id, e.target.value)}
              help="Example: YourEmail@domain.com"
              disabled={this.state.isSubbed || this.state.isLoading}
            />
            <FieldGroup
              id="MobileNumber"
              type="tel"
              name="MobileNumber"
              label="Mobile Phone"
              onChange={(e) => this.handleChange(e.target.id, e.target.value)}
              disabled={this.state.isSubbed || this.state.isLoading}
              help="Example: 18134477789"
            />
            <FieldGroup
              id="XPath"
              name="XPath"
              type="text"
              label="XPath"
              onChange={(e) => this.handleChange(e.target.id, e.target.value)}
              help="Example: (//table//tr)[position() < last()]"
              disabled={this.state.isSubbed || this.state.isLoading}
            />
            <p>* Required field.</p>
            <Button type="submit" 
              bsStyle="primary" 
              bsSize="large" 
              disabled={this.state.isLoading || this.state.isSubbed || this.state.invalid} 
           >
              {this.state.isLoading && 'Subscribing..'}
              {this.state.isSubbed && 'Subscribed!'}
              {!this.state.isSubbed && !this.state.isLoading && 'Subscribe!'}
            </Button>
            {this.state.isSubbed &&
              <Button type="reset" 
                bsStyle="link" 
                bsSize="large" 
                >
                Add Another Subscription
              </Button>
            }
          </Form>
        </Panel>
        {this.state.invalid && this.state.invalidMessage !== '' &&
        <Alert bsStyle="danger" >
          {this.state.invalidMessage}
        </Alert>}
        {this.state.isFailure &&
        <Alert bsStyle="danger" >
          <strong>Could not Save Subscription.</strong> {this.state.failureMessage}
        </Alert>}
        {this.state.isSubbed &&
        <Alert bsStyle="success" >
          <strong>Subscription Saved.</strong> {this.state.successMessage}
        </Alert>}
        <p> Make sure we are not on your spam list! The emails from Skraper will come from angelusualle@gmail.com</p>
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
