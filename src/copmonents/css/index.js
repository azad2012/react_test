import React from 'react';
import ChildCopmonent from './Child';
import List from './List';

function CssCopmonent(props) {
    return <>
        <ChildCopmonent/>
        <List/>
       <div className="font-20"> Hello</div>
       <div>Azad</div>
    </>;
}

export default CssCopmonent;