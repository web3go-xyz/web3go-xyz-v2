/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { LayoutLoginApi } from '@/services';
const mapStateToProps = state => ({

});
class Component extends React.Component {
    constructor(props) {
        super(props)
    }
    login = () => {
        LayoutLoginApi.login().then(d => {

        })
    }
    render() {
        return (<div className="web3go-layout-page">
            email <input type="text" 