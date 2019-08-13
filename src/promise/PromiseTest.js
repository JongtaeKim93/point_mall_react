import React from 'react';

class PromiseTest extends React.Component{

    callback(func){
        for(let i=0; i<10; i++){
            func(i);
        }
    }
    
    callbackTest = () => {
        const callbackfunc = function(i){
            console.log('callback: ' + i);
        };
        this.callback(callbackfunc);
    }

    promiseTest = () => {
        // const promise = new Promise((resolve, reject) => {
        //     let a = 1;
        //     const b = 2;
        //     resolve(a + b);
        //     a = 10;
        //     console.log('after resolve');
        // });
        // promise.then((result => {
        //     console.log('promise ' + result);
        //     return result;
        // }).catch(() => {
        //     console.log('promise catch');
        // })

    }

    render(){
        return(
            <div>
                <h1>Promise Test</h1>
                <button onClick={this.callbackTest}>Callback</button>
                <button onClick={this.promiseTest}>Promise</button>
            </div>
        )
    }
}

export default PromiseTest;