import React, { Component,PureComponent } from 'react';

class PureTest extends PureComponent {
    render() {
        console.log('rende pure test')
        console.log(this.props)
        return (
            <div onClick={this.props.reset}>
                sum is{this.props.value}
            </div>
        );
    }
}

export default PureTest;