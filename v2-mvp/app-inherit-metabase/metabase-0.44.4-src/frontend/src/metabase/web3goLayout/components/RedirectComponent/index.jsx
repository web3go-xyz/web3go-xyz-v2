/* eslint-disable react/prop-types */
import React from "react";

class Component extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.router.replace({
            pathname: this.props.location.state.pathname,
            state: this.props.location.state.state || {}
        })
    }
    render() {
        return <div></div>
    }
}


export default Component;
