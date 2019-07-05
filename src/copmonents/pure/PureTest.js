import React, { Component,PureComponent } from 'react';

class PureTest extends PureComponent {
    render() {
        console.log('rende pure test')
        return (
            <div>
                hi
            </div>
        );
    }
}

export default PureTest;