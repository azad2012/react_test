import React,{createRef} from 'react';
import { ItemComponent } from './ItemComponent';

// import * as flatten from 'tree-flatten';

class Tree extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            firstScroll:false,
        }
        this.num = 0;
        this.forwardrefs  = {};
        this.treeData = [
            {
                document_id:0,
                children:[
                    {
                        document_id:1,
                        children:[
                            {document_id:2},
                            {document_id:20},
                        ]
                    },
                    {   document_id:5,
                        children:[
                            {
                                document_id:3,
                                children:[
                                    {document_id:6},
                                    {document_id:7,
                                        children:[
                                            {document_id:10}
                                        ]},
                                    {document_id:8}
                                ]
                            },
                            {
                                document_id:33,
                            }
                        ]
                    }
                ]
            }
        ]
    }




    scrollToIndex = (index) => {
        // this.messagesEnd.scrollIntoView({behavior: "smooth",block: 'start',});
        console.log(index,this.forwardrefs[index])

        this.forwardrefs[index] && this.forwardrefs[index].current && this.forwardrefs[index].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    componentDidMount(){
        this.scrollToIndex(12);
    }
    // componentDidUpdate() {
    //     /**
    //      * @desc first time in  page mounting will be scroll
    //      */
    //     if(!this.state.firstScroll){
    //         this.scrollToIndex(12);
    //         /**
    //          * first scroll is done
    //          */
    //         this.setState({firstScroll:true});
    //     }
    // }
    createTree(data, lev) {
        let level = lev || 0;
        let cc = [];
        console.log(level)
        for (let i in data) {
            this.num=this.num+1;
            const {children,...withoutChildren} = data[i]
            // console.log(this.num,i,withoutChildren.document_id)
            this.forwardrefs[this.num] = createRef()
                cc.push(
                        // <hr className="c-conversation_hr" style={{margin:"0",position: "relative"}}/>
                        <div 
                        style={{display:"flex"}} className={"filter-group level-" + (level)}
                        key={this.num}
                        >
                            <div className={"connection-" + (level)}>
                                <hr className="connection" />
                            </div>
                            <div style={{zIndex:"3"}}>
                                    <ItemComponent 
                                    withoutChildren={withoutChildren}
                                    forward={this.forwardrefs[this.num]}
                                    index={this.num}
                                    />
                                    {
                                    data[i].children && data[i].children.length>0 ? 
                                    <div>{this.createTree(data[i].children, level+1) }</div>
                                    :
                                    null
                                    }

                            </div>

                        </div>
                );
            // } 

        }
        return <>{cc}</>;
    }



    render() {
        const {children,...withoutChildren} =this.treeData[0];
        console.log([withoutChildren,...children]);
        return (
            <div style={{direction:"rtl"}}>

                {
                    this.createTree([withoutChildren,...children])
                }
            </div>
        );
    }
}


export default Tree;

