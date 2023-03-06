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
    sure = () => {
        this.setState({ visible: false })
    }
    refreshDatasetList = () => {
        this.props.getDatasetList();
    }
    editDataset = (v) => {
        const cardId = v.id;
        const slug = slugg(v.name);
        const suffix = slug ? `${cardId}-${slug}` : cardId;
        window.open(`/layout/create/dataset/${suffix}`);
    }
    delDataset = (datasetObj) => {
        Modal.confirm({
            wrapClassName: 'common-confirm-modal',
            closable: true,
            title: 'Delete',
            content:
                'Are you sure to delete ?',
            cancelText: 'Cancel',
            onOk: async () => {
                const linkedDashCardList = this.props.dashboard.ordered_cards.filter(v => {
                    const str = v.card && v.card.dataset_query && v.card.dataset_query.query && v.card.dataset_query.query['source-table'];
                    let card_id2;
                    if (str.startsWith('card__')) {
                        card_id2 = str.split('__')[1];
                    } else {
                        card_id2 = str;
                    }
                    if (card_id2 == datasetObj.id) {
                        return true
                    }
                    return false;
                })
                for (const v of linkedDashCardList) {
                    await this.props.removeCardFromDashboard({
                        dashId: this.props.dashboard.id,
                        dashcardId: v.id
                    })
                }
            }
        });
    }
    render() {
        const { datasetList } = this.props;
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
                        <Button onClick={this.refreshDatasetList} type='outline' className="btn">
                            <IconSync style={{ fontSize: 16 }} />
                            <span>Refresh</span>
                        </Button>
                    </div>
                    {
                        this.props.getUsedDatasetListLoading ? <Spin style={
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
