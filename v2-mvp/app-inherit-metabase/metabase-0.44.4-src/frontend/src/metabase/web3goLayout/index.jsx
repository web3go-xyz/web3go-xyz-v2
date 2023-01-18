/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import BaseHeader from './BaseHeader';
import BaseFooter from './BaseFooter';

const mapStateToProps = state => ({
    route: state.routing.locationBeforeTransitions,
});
class Component extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
    }
    render() {
        const showFooter = this.props.route.pathname.includes('/layout/create') ? false : true;
        return (<div className="web3go-layout-page">
            <BaseHeader />
            <div className="container-content">
                <div className="content">
                    {this.props.children}
                </div>
            </div>
            {showFooter ? <BaseFooter /> : null}
        </div>)

    }

}


export default connect(mapStateToProps)(Component);
