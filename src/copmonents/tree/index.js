import React,{createRef} from 'react';

// import * as flatten from 'tree-flatten';

class Tree extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            firstScroll:false
        }
        this.forwardrefs  = {};
        this.treeData = [{
            document_id:0,
            children:
                [
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
        }]
    }




    scrollToIndex = (index) => {
        // this.messagesEnd.scrollIntoView({behavior: "smooth",block: 'start',});
        this.forwardrefs[index] && this.forwardrefs[index].current && this.forwardrefs[index].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }


    componentDidUpdate() {
        /**
         * @desc first time in  page mounting will be scroll
         */
        if(this.props.threadData.length && !this.state.firstScroll){
            // this.scrollToIndex(flattedData[flattedData.length-1].id);
            /**
             * first scroll is done
             */
            this.setState({firstScroll:true});
        }
    }
    createTree(data, lev) {
        let level = lev || 0;
        let cc = [];
        for (let i in data) {
            console.log(i)
            const {children,...withoutChildren} = data[i]
            // console.log(children,withoutChildren,data[i])
            cc.push(
                    <div style={{border:"1px solid grey",marginBottom:"10px",zIndex:"2",backgroundColor:"grey"}}>
                        {withoutChildren.document_id}     
                    </div>
            );
            if (data[i].children && data[i].children.length>0 ) { // Sub array found, build structure
                cc.push(
                    <div style={{display:"flex"}}>
                        <hr className="c-conversation_hr" style={{margin:"0",position: "relative",bottom: "10px",left: "18px",zIndex:"1"}}/>
                        <div className={"filter-group level-" + (level)}>
                            {this.createTree(data[i].children, level+1)}
                        </div>
                    </div>
                );
            } 

        }
        console.log(cc)
        return <>{cc}</>;
    }



    render() {
        return (
            <div className="c-conversation">

                {
                    this.createTree(this.treeData)
                }
            </div>
        );
    }
}


export default Tree;

