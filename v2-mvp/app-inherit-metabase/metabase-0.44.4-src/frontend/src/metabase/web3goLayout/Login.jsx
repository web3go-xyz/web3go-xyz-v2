/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
const mapStateToProps = state => ({

});
class Component extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (<div className="web3go-layout-page">
            email <input type="text" />
            password <input type="text" />
        </div>)

    }

}


export default connect(mapStateToProps)(Component);
