import React, { Component } from 'react';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
        <h3>Welcome to Skraper3</h3>
        <h4>It watches websites and lets you know when they change.</h4>
        <p>To subscribe to a website, simply enter below its URL, your email and optional phone number to get alerted when the site changes.</p>
        <p>Test</p>
        <p>*There is also an optional XPath parameter that 
          can be used to specify if only part of a website should be watched. Please see below to test your XPath:</p>
        <a href="http://videlibri.sourceforge.net/cgi-bin/xidelcgi">HTML XPath testing site</a>
        <br/>
        <a href="http://benibela.de/documentation/internettools/xquery.TXQueryEngine.html">HTML XPath Guide</a>
      </div>
    );
  }
}
