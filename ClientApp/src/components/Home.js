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
    isSubbed: false
  }

  handleChange(id, val) {
    this.setState({[id]:val})
    if (this.state.URL.length !== 0 || this.state.Email.length !== 0) {
      this.setState({invalid:false})
      return;
    }
  }

  handleSub(){
    if (this.state.URL.length === 0 || this.state.Email.length === 0) {
      this.setState({invalid:true})
      return;
    }
    this.setState({isLoading:true});
    fetch('api/Subscription/Add', {
          method:'POST',
          body: JSON.stringify(this.state),
          headers:{'Content-Type': 'application/json;charset=UTF-8'}
        })
    .then(response => {
        this.setState({successMessage: response, isSubbed: true});
    }).catch((e) => console.log(e));
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
            placeholder="YourEmail@domain.com"
          />
          <FieldGroup
            id="MobileNumber"
            type="tel"
            label="Mobile Phone"
            onChange={(e) => this.handleChange(e.target.id, e.target.value)}
            placeholder="15555555"
          />
          <FieldGroup
            id="XPath"
            type="text"
            label="XPath"
            onChange={(e) => this.handleChange(e.target.id, e.target.value)}
            placeholder="(//table[contains(@summary, 'This layout table is used to present the seating numbers.')]//tr)[position() < last()]"
          />
          <p>* Required field.</p>
          <Button bsStyle="primary" bsSize="large" disabled={this.state.isLoading} onClick={!this.state.isLoading ? (e) => this.handleSub(): null}>
            {this.state.isLoading ? 'Subscribing..' : "Subscribe!"}
          </Button>
        </Panel>
        {this.state.invalid &&
        <Alert bsStyle="danger" >
          <strong>Missing Required Data!</strong> Make sure the URL and Email are filled out.
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
