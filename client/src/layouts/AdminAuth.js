import React from 'react';
import { Redirect } from "react-router-dom";
import store from "../redux/store";
import { connect } from "react-redux";
import { adminAuthenticate } from "../api/apiAdmin";
import { appLoading, open_appAlert } from "../utils/appFunction";
import axios from "axios";

class AdminAuth extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      admin_tel: "",
      admin_pas: "",
      pas_type: "text",
      admin: {},
    //   ori_admin: "{}"
    }
  }

  componentDidMount = async () => {
    this.setState({
        admin: this.props.admin,
        // ori_admin: JSON.stringify(this.props.admin)
    })
    // subscribe to store change first
    this.unsubscribe = store.subscribe(() => {
      let store_admin = store.getState().admin;
      if(store_admin.admin_id){
        this.setState({
            admin: store_admin
        })
      }
    })
    appLoading(false);
  }

  changeAuthInfo = event => {
      let attr = event.target.name;
      let value = event.target.value;
      let state = {...this.state};
      state[attr] = value;
      this.setState(state);
  }

  submitAdminAuth = async (event) => {
    try{
        event.preventDefault();
        let { admin_tel, admin_pas } = this.state;
        let admin = await adminAuthenticate({admin_tel: admin_tel, admin_pas: admin_pas});
        if(admin.admin_id){
            axios.defaults.headers.common['Authorization'] = `{"admin_cookie": "${admin.admin_cookie}"}`;
            localStorage.setItem("admin_cookie", admin.admin_cookie);
            this.props.dispatch({type: "UPDATE_ADMIN", payload: admin});
        }else{
            open_appAlert({
                timeOut: 3000,
                title: (
                    <div
                        style={{textAlign: "center", color: "red", height: "50px", padding: "15px", fontSize: "18px"}}
                    >THÔNG TIN ĐĂNG NHẬP KHÔNG ĐÚNG</div>
                ),
                message: (
                    <div
                        style={{textAlign: "center", padding: "20px"}}
                    >Vui lòng kiểm tra lại thông tin đăng nhập</div>
                )
    
            })
        }
    }catch(err){
        open_appAlert({
            timeOut: 3000,
            title: (
                <div
                    style={{textAlign: "center", color: "red", height: "50px", padding: "15px", fontSize: "18px"}}
                >LỖI HỆ THỐNG</div>
            ),
            message: (
                <div
                    style={{textAlign: "center", padding: "20px"}}
                >Có lỗi gì đó từ hệ thống, hãy kiểm tra lại!</div>
            )

        })
    }
  }

  componentWillUnmount = () => this.unsubscribe();

  render = () => {
    let { admin, admin_tel, admin_pas, pas_type } = this.state;
    return (
      <React.Fragment>
        {admin && admin.admin_id ? (
            <Redirect to="/admin"></Redirect>
        ) : (
            <div className="AdminAuth">
                <div className="adminAuthWrapper">
                    <h1 className="title">PHỤ KIỆN DHQG CHẤM CƠM</h1>
                    <form onSubmit={(event) => this.submitAdminAuth(event)}>
                        <input
                            value={admin_tel}
                            name="admin_tel"
                            placeholder="auth phone number please..."
                            onChange={(event) => {this.changeAuthInfo(event)}}
                        />
                        <input
                            value={admin_pas}
                            name="admin_pas"
                            type={pas_type}
                            placeholder="...auth password please..."
                            onChange={(event) => {this.changeAuthInfo(event)}}
                        />
                        <button className="submit">Đăng nhập</button>
                    </form>
                </div>
            </div>
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state){
  return {
    admin: state.admin
  }
}

export default connect(mapStateToProps)(AdminAuth);