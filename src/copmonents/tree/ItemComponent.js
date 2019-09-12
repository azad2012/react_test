import React from 'react';

export const ItemComponent = (props)=>{
    console.log(props.forward)
    return(
        <div 
        ref={props.forward}
        style={{
            // border:"1px solid grey",
            marginBottom:"10px",
            backgroundColor:"grey",
            width:"200px"
        }}>
            {props.withoutChildren.document_id}     
        </div>
    )
}