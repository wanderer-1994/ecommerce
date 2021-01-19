import React from "react";
import { connect } from "react-redux";
import UserNavbar from "./user/UserNavbar";
import UserSidebar from "./user/UserSidebar";
import UserPages from "./user/UserPages";
import UserFooter from "./user/UserFooter"
import './User.css';
import "./user/UserPages.css";
import { BrowserRouter, Route } from "react-router-dom";
import UserHomePage from "./user/userPages/UserHomePage";

class User extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            count: 1,
        }
    }

    componentDidMount = () => {
        // this.props.dispatch({type: "UPDATE_APPLOADING", payload: 0});
    }

    render() {
        return (
            <div className="UserLayout">
                {/* làm thế này để lấy this.props.location cho user navbar và sidebar */}
                <Route path="*" component={UserNavbar}/>
                <Route path="*" component={UserSidebar}/>
                {/* <UserNavbar /> */}
                {/* <UserSidebar /> */}
                <div className="UserWrapper">
                    <UserFooter />
                    <Route exact path="/" component={UserHomePage} />
                    <Route path="/:url" component={UserPages} />
                </div>
            </div>
        ); 
    }
}

function mapStateToProps(state){
    return {
        
    }
};

export default connect(mapStateToProps)(User);