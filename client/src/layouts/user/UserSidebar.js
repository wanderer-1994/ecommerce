import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import './UserSidebar.css';
import { getSidebarLinks } from "../../api/apiCall";
import sidebarbackground from "../../assets/sidebarbackground.jpg";
import Close from "@material-ui/icons/Close";
import { toggleSidebar } from "../../utils/functions";

class UserSidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      links: [],
      pathname: this.props.location.pathname
    }
  }

  componentDidMount = async () => {
    let links = await getSidebarLinks();
    this.setState({links: links});
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if(this.props.location.pathname != nextProps.location.pathname){
      this.setState({pathname: nextProps.location.pathname});
    };
  }

  handleToggleSidebar = () => {
    let isMobile = window.innerWidth < 800 ? true : false;
    if(isMobile) setTimeout(() => {
      toggleSidebar()
    }, 200);
  }

  render() {
    let height = window.outerHeight + 100;
    let isMobile = window.innerWidth < 800 ? true : false;
    let pathname = this.state.pathname;
    return (
      <div className="UserSidebar Side SideBar">
        <div className="mobileSidebarClose">
          <Close onClick={() => {toggleSidebar()}}/>
        </div>
        <ul
          style={isMobile ? {background: `url(${sidebarbackground})`, backgroundSize: `auto ${height}px`, backgroundRepeat: "no-repeat"} : null}
        >
          <div>
            {this.state.links.map(item => {
              let category_path_arr = item.category_path.split("/");
              let category_last_path = category_path_arr[category_path_arr.length - 1];
              let to = "/" + category_last_path + "_cat" + item.category_path.replace(/\//g, ".").replace(/\\/g, ".").replace(/\.+/g, ".");
              let className = `level_${item.category_path.split("/").length - 1}`;
              let isActive = (pathname == to ? true : false);
              return (
              <li key={item.category_id}>
                <Link
                  className={isActive ? `${className} active` : className}
                  to={to}
                  onClick={() => this.handleToggleSidebar()}
                >{item.category_name}
                </Link>
              </li>)
            })}
          </div>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
      
    }
};

export default connect(mapStateToProps)(UserSidebar);