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
    toggleDark,
    push,
};

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            datasetList: []
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.usedDatasetList) !== JSON.stringify(this.props.usedDatasetList)) {
            this.getDatasetList();
        }
    }
    getDatasetList = async () => {
        this.setState({
            loading: true
        });
        let promiseArr = [];
        this.props.usedDatasetList.forEach(v => {
            let cardId;
            if (v.startsWith('card__')) {
                cardId = v.split('__')[1];
            } else {
                cardId = v;
            }
            promiseArr.push(CardApi.get({
                cardId: cardId
            }))
        });
        const resultArr = await Promise.all(promiseArr);
        this.setState({
            datasetList: resultArr,
            loading: false
        });
    }
    init = () => {
        this.setState({
            visible: true
        })

    }
    sure = () => {

    }
    editDataset = () => {

    }
    delDataset = () => {

    }
    render() {
        const { datasetList, loading } = this.state;
        return (
            <Modal
                autoFocus={false}
                style={{ width: '635px' }}
                wrapClassName="common-form-modal create-dashboard-link-datasets-modal"
                title='Linked Datasets'
                visible={this.state.visible}
                onCancel={() => this.setState({ visible: false })}
                onOk={this.sure}
            >
                <div className="modal-content">
                    <div className="btn-wrap">
                        <Button type='outline' className="btn">
                            <IconSync style={{ fontSize: 16 }} />
                            <span>Refresh</span>
                        </Button>
                    </div>
                    {

                        loading ? <Spin style={
                            {
                                display: 'block', minHeight: 100, display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }></Spin >
                            : !datasetList.length ? null : <div className="list">
                                {
                                    datasetList.map(v => (
                                        <div className="item" key={v.id}>
                                            <span>{v.name}</span>
                                            <div className="i-right">
                                                <IconEdit className="hover-item" onClick={() => { this.editDataset(v) }} />
                                                <div className="split"></div>
                                                <IconMinusCircle className="hover-item" onClick={() => { this.delDataset(v) }} />
                                            </div>
                                        </div>
                                    )
                                    )
                                }
                            </div>
                    }

                    <div className="split-wrap">
                        <span className="line"></span>
                        <span className="text">or</span>
                        <span className="line"></span>
                    </div>
                    <Link target="_blank" to={{ pathname: '/layout/create' }}>
                        <Button className="create" type='primary' icon={<IconPlus />}>
                            Add new datasets
                        </Button>
                    </Link>
                </div>
            </Modal >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
