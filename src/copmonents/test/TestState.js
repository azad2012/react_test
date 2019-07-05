import React, { Component } from 'react';
import PureTest from '../pure/PureTest';

class TestState extends Component {
    state ={
        count : 0,
        sum: 0,
    }

    /**
     * wrong not work because execute async and not update count for next line
     */
    // handleOnClicK1 = ()=>{
    //     this.setState({count:this.state.count+1})
    //     this.setState({sum:this.state.sum+this.state.count})
    // }

    handleOnClicK1 = ()=>{
        /**
         * true
         */
        this.setState((state,props)=>{
            console.log(this.state.count)
            return ({count:state.count+1})
        })
        console.log(this.state.count)
        this.setState((state,props)=>{
            console.log(state.count)
            console.log(this.state.count)
            return ({sum:state.sum+state.count})
        })
        /**
         * wrong
         */
        // this.setState((state,props)=>({count:state.count+1,sum:state.sum+state.count}))
    }
    /**
     * true another way
     */
    // handleOnClicK1 = async()=>{
    //     await this.setState({count:this.state.count+1})
    //     await this.setState({sum:this.state.sum+this.state.count})
    // }
    /**
     * definitely wrong mutate directely
     */
    handleOnClicK2 = ()=>{
        this.state.count =this.state.count+1;
        console.log(this.state.count)
    }
    render() {
        return (
            <div>
                <button onClick={this.handleOnClicK1}>button1</button>
                <button onClick={this.handleOnClicK2}>button2</button>
                <br/>
                {this.state.count}
                <br/>
                {this.state.sum}
                {/* Pure test is a child component */}
                <PureTest/>
            </div>
        );
    }
}

export default TestState;