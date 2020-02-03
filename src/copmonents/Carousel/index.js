import React from 'react'
import './index.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6


// class TodoList extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {items: ['hello', 'world', 'click', 'me']};
//       this.handleAdd = this.handleAdd.bind(this);
//     }
  
//     handleAdd() {
//       const newItems = this.state.items.concat([
//         prompt('Enter some text')
//       ]);
//       this.setState({items: newItems});
//     }
  
//     handleRemove(i) {
//       let newItems = this.state.items.slice();
//       newItems.splice(i, 1);
//       this.setState({items: newItems});
//     }
  
//     render() {
//       const items = this.state.items.map((item, i) => (
//         <div key={item} onClick={() => this.handleRemove(i)}>
//           {item}
//         </div>
//       ));
  
//       return (
//         <div>
//           <button onClick={this.handleAdd}>Add Item</button>
//           <ReactCSSTransitionGroup
//             transitionName="example"
//             transitionEnterTimeout={500}
//             transitionLeaveTimeout={300}>
  
//             {items}
//           </ReactCSSTransitionGroup>
//         </div>
//       );
//     }
//   }
// export default TodoList;

class Carousel extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            items: items,
            active: 0,
            direction: ''
        }
        this.rightClick = this.moveRight.bind(this)
        this.leftClick = this.moveLeft.bind(this)
    }

    generateItems() {
        var items = []
        var level
        console.log(this.state.active)
        for (var i = this.state.active - 2; i < this.state.active + 3; i++) {
            var index = i
            if (i < 0) {
                index = this.state.items.length + i
            } else if (i >= this.state.items.length) {
                index = i % this.state.items.length
            }
            level = this.state.active - i
            items.push(<Item key={index} id={this.state.items[index]} level={level} />)
        }
        return items
    }
    
    moveLeft() {
        var newActive = this.state.active
        newActive--
        this.setState({
            active: newActive < 0 ? this.state.items.length - 1 : newActive,
            direction: 'left'
        })
    }
    
    moveRight() {
        var newActive = this.state.active
        this.setState({
            active: (newActive + 1) % this.state.items.length,
            direction: 'right'
        })
    }
    
    render() {
        return(
            <div id="carousel" className="noselect">
                <div className="arrow arrow-left" onClick={this.leftClick}><i className="fi-arrow-left"></i></div>
                {this.generateItems()}

                <ReactCSSTransitionGroup 
                    transitionName={this.state.direction}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                    >
                </ReactCSSTransitionGroup>
                <div className="arrow arrow-right" onClick={this.rightClick}><i className="fi-arrow-right"></i></div>
            </div>
        )
    }
}

class Item extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            level: this.props.level
        }
    }
    
    render() {
        const className = 'item level' + this.props.level
        return(
            <div className={className}>
                {this.props.id}
            </div>
        )
    }
}

var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default Carousel;