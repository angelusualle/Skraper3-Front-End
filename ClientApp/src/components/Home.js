import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Panel, Button, Alert } from 'react-bootstrap';
import './Home.css';

export class Home extends Component {
  displayName = Home.name
  state = {
    URL: '',
    Email: '',
    MobileNumber: '',
    XPath: '',
    isLoading: false,
    invalid: false,
    successMessage: '',
    isSubbed: false,
    failureMessage: '',
    isFailure: false
  }

  initState={
    URL: '',
    Email: '',
    MobileNumber: '',
    XPath: '',
    isLoading: false,
    invalid: false,
    successMessage: '',
    isSubbed: false,
    failureMessage: '',
    isFailure: false
  }
  
  reset(){
    this.setState(this.state.initState);
  }

  validData(){
    if (this.state.URL.length === 0 || this.state.Email.length === 0) return false;
    return true;
  }

  handleChange(id, val) {
    this.setState({[id]:val})
    if (!this.validData()) {
      this.setState({invalid:false})
      return;
    }
  }

  handleSub(){
    if (!this.validData()) {
      this.setState({invalid:true})
      return;
    }
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
        <p>To subscribe to a website, enter in form below its URL, your email and optional phone number to get alerted when the site changes.</p>
        <h3>XPath</h3>
        <p>There is also an optional XPath parameter that 
          can be used to specify if only part of a website should be watched. Please see below to test your XPath:</p>
        <a href="http://videlibri.sourceforge.net/cgi-bin/xidelcgi">HTML XPath testing site</a>
        <br/>
        <a href="http://benibela.de/documentation/internettools/xquery.TXQueryEngine.html">HTML XPath Guide</a>
        <br/>
        <br/>
        <Panel>
          <FieldGroup
            id="URL"
            type="text"
            label="*URL"
            onChange={(e) => this.handleChange(e.target.id, e.target.value)}
            
            placeholder="http://somesitetowatch.com"
          />
          <FieldGroup
            id="Email"
            type="email"
            label="*Email"
            onChange={(e) => this.handleChange(e.target.id, e.target.value)}
            disabled={this.state.isSubbed}
            placeholder="YourEmail@domain.com"
          />
          <FieldGroup
            id="MobileNumber"
            type="tel"
            label="Mobile Phone"
            onChange={(e) => this.handleChange(e.target.id, e.target.value)}
            disabled={this.state.isSubbed}
            placeholder="15555555"
          />
          <FieldGroup
            id="XPath"
            type="text"
            label="XPath"
            onChange={(e) => this.handleChange(e.target.id, e.target.value)}
            placeholder="(//table[contains(@summary, 'This layout table is used to present the seating numbers.')]//tr)[position() < last()]"
            disabled={this.state.isSubbed}
          />
          <p>* Required field.</p>
          <Button bsStyle="primary" bsSize="large" disabled={this.state.isLoading || this.state.isSubbed} onClick={!this.state.isLoading ? (e) => this.handleSub(): null}>
            {this.state.isLoading && 'Subscribing..'}
            {this.state.isSubbed && 'Subscribed!'}
            {!this.state.isSubbed && !this.state.isLoading && 'Subscribe!'}
          </Button>
          {this.state.isSubbed &&
            <Button bsStyle="info" bsSize="large" onClick={(e) => this.reset()}>
              Add Another Subscription
            </Button>
          }
        </Panel>
        {this.state.invalid &&
        <Alert bsStyle="danger" >
          <strong>Missing Required Data!</strong> Make sure the URL and Email are filled out.
        </Alert>}
        {this.state.isFailure &&
        <Alert bsStyle="danger" >
          <strong>Could not Save Subscription.</strong> {this.state.failureMessage}
        </Alert>}
        {this.state.isSubbed &&
        <Alert bsStyle="success" >
          <strong>Subscription Saved.</strong> {this.state.successMessage}
        </Alert>}
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
