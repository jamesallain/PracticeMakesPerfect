import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component{
	constructor(props){
		super(props);
		this.state= {
			name:"huxinmin"
		}
	}
	render(){
		return(
			     <div>{this.state.name}</div>
			)
	}
}

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render( < App / > , app);