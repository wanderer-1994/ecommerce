import React from "react";
import ShoppingCart from "@material-ui/icons/ShoppingCart";

class AppLoading extends React.Component {
  render() {
    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#ababab00",
        paddingTop: "40vh",
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: "10000",
      }}>
          <div className="appLoading" style={{textAlign: "center", fontSize: 30, fontWeight: "bold", opacity: "0.1"}}>phukienDHQG.com</div>
      </div>
    );
  }
}

export default AppLoading;