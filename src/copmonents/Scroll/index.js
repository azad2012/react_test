import React, { Component , createRef } from 'react';
import "./index.scss"
class Scroll extends Component {
  constructor(props) {
    super(props);
    this.forwardrefs  = {};
    this.myRef = createRef();
    this.parentRef  = createRef()
    this.firstLastNumsCount = 2;
    this.middleNumsCount = 4;
    this.changePercentage = 0;
    this.state = {
      firstIndex:0,
      stoppedIndex:0,
      ratio : 0
    }
  }
  checkScroll = ()=>{
    // console.log(this.forwardrefs[4].current.overflowY)
    // console.log((this.parentRef.current.scrollTop-this.state.stoppedIndex*40)%40)
    this.setState({firstIndex: this.parentRef.current.scrollTop/40},()=>{
      this.setState({ratio: ((this.parentRef.current.scrollTop-Math.round(this.state.firstIndex)*40)%40)/40 })
      // if(Number.isInteger(this.state.firstIndex)){
      //   this.setState({stoppedIndex:this.state.firstIndex});
      // }
      // if((this.state.firstIndex-this.state.stoppedIndex) > 1){
      //   this.setState({stoppedIndex:Math.round(this.state.firstIndex)*40});
      // }
    });

  }
  renderItems = (items)=>items.map((item,index)=>{
    this.forwardrefs[index] = createRef();
    let className = ""
    const {firstIndex} = this.state;
    const firstIndexRound = Math.round(firstIndex);
    console.log(this.state.ratio,this.state.firstIndex)
    if(index>=firstIndexRound+this.firstLastNumsCount && index < firstIndexRound+this.firstLastNumsCount + this.middleNumsCount){
      className = "middleItems"
    }else{
      className = "firstItems"
    }
    if(index>=firstIndexRound+this.firstLastNumsCount && index < firstIndexRound+this.firstLastNumsCount + this.middleNumsCount){
      if(index===Math.round(this.state.firstIndex)+this.firstLastNumsCount ){
        const size = -this.state.ratio*14 + 28 ;
        return(
          <p  style={{fontSize:`${size}px`,height:"40px"}}  key={index}>
            {item}
          </p>
        )
      }else {
        return(
          <p className={className} style={{height:"40px"}} key={index}>
            {item}
          </p>
        )
      }
    }else{
      if(index===firstIndexRound+this.firstLastNumsCount + this.middleNumsCount){
        const size = this.state.ratio*14 + 14 ;
        return(
          <p  style={{fontSize:`${size}px`,height:"40px"}}  key={index}>
            {item}
          </p>
        )
      }else{
        return(
          <p className={className} style={{height:"40px"}} key={index}>
            {item}
          </p>
        )
      }

    }



    // if(index>=firstIndex+this.firstLastNumsCount && index < firstIndex+this.firstLastNumsCount + this.middleNumsCount){
    //   if(index===this.state.stoppedIndex+this.firstLastNumsCount + this.middleNumsCount-1){
    //     const size = this.state.ratio*10 + 14 ;
    //     return(
    //       <p  style={{fontSize:`${size}px`,height:"40px"}}  key={index}>
    //         {item}
    //       </p>
    //     )
    //   }else{
    //     return(
    //       <p  style={{height:"40px"}} key={index}>
    //         {item}
    //       </p>
    //     )
    //   }

    // }else{
    //   return(
    //     <p  style={{height:"40px"}} key={index}>
    //       {item}
    //     </p>
    //   )
    // }
  })
  render() {
    return (
      <div ref={this.parentRef} onScroll={this.checkScroll} className="scroll">
        {this.renderItems([0,1,2,3,4,5,6,7,8,9,10,11,12,13])}
        {/* <p  ref={this.myRef} style={{height:"40px"}}>1</p>
        <p  ref={this.myRef} style={{height:"40px"}}>2</p>
        <p  ref={this.myRef} style={{height:"40px"}}>3</p>
        <p  ref={this.myRef} style={{height:"40px"}}>4</p>
        <p  ref={this.myRef} style={{height:"40px"}}>5</p>
        <p  ref={this.myRef} style={{height:"40px"}}>6</p>
        <p  ref={this.myRef} style={{height:"40px"}}>7</p>
        <p  ref={this.myRef} style={{height:"40px"}}>8</p> */}
      </div>
    );
  }
}

export default Scroll;