/* eslint-disable react/prop-types */
import React from "react";
import slugg from "slugg";

import { connect } from "react-redux";
import './index.less';
import { Form, Input, Button, Grid, Select, InputNumber, Tooltip, Space, Modal, Message, Spin } from '@arco-design/web-react';
import { toggleDark, changeMyDashboardList } from "metabase/redux/app";
import { push } from "react-router-redux";
import { IconLaunch, IconSync, IconMinusCircle, IconEdit, CircleIconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { IconPlus } from '@arco-design/web-react/icon';
import { position } from "tether";
import { copy } from '@/web3goLayout/utils'
import { Link } from "react-router";
import { LayoutLoginApi, LayoutDashboardApi, CardApi, MetabaseApi } from '@/services';
import {
    getDashboardComplete,
} from "@/dashboard/selectors";
import Questions from "metabase/entities/questions";
import * as dashboardActions from "@/dashboard/actions";

const Option = Select.Option;
const mapStateToProps = (state, props) => {
    return {
        isDark: state.app.isDark,
        userData: state.app.userData,
        myDashboardList: state.app.myDashboardList,
        dashboard: getDashboardComplete(state, props)
    }
};
const mapDispatchToProps = {
    ...dashboardActions,
    toggleDark,
    push,
    archive: id => Questions.actions.setArchived({ id }, true),
};

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.usedDatasetList) !== JSON.stringify(this.props.usedDatasetList)) {
            this.props.getDatasetList();
        }
    }

    init = () => {
        this.setState({
            visible: true
        })
    }


    render() {
        const { usedDashboardList } = this.props;
        return (
            <Modal
                autoFocus={false}
                style={{ width: '635px' }}
                wrapClassName="common-form-modal create-dashboard-link-datasets-modal"
                title='Linked Dashboards'
                visible={this.state.visible}
                onCancel={() => this.setState({ visible: false })}
                onOk={this.sure}
            >
                <div className="modal-content">
                    <div className="list">
                        {
                            usedDashboardList.map(v => (
                                <div className="item" key={v.id}>
                                    <span>{v.name}</span>
                                </div>
                            )
                            )
                        }
                    </div>
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
