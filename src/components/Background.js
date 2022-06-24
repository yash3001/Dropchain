import React,{Component} from "react";
import "./Background.css";

class Background extends Component{
    render(){
        return(
            
            
            <div className="home">
                
                <div className="animation-area">
                    <ul className="box-area">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
          
                </div>

                <div className="banner-text" >
                    {this.props.children}
                </div>
               
                
          </div>
        
        )
    }
}

export default Background;
