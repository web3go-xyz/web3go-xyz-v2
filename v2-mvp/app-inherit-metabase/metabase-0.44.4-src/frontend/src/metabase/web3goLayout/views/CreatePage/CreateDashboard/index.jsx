/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push } from "react-router-redux";
import cx from "classnames";
import AddChartModal from './AddChartModal';
import * as Urls from "metabase/lib/urls";
import { DashboardApi } from '@/services';
import slugg from "slugg";
import DashboardApp from "metabase/dashboard/containers/DashboardApp";


import { addTextDashCardToDashboard, addImageDashCardToDashboard, addVideoDashCardToDashboard } from "../../../../dashboard/actions";

const { Text } = Typography;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
    }
};
const mapDispatchToProps = {
    push,

};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ifEditDashboardName: false,
            dashboardName: 'New dashboard',
            tagList: ['aaa'],
            ifEditTag: false,
            addTagName: ''
        }
        this.dashboardNameInputRef = React.createRef();
        this.tagInputRef = React.createRef();
        this.AddChartModalRef = React.createRef();
    }
    async componentDidMount() {
        if (!this.props.location.query.dashboardSlug) {
            const result = await DashboardApi.create({
                "name": this.state.dashboardName,
                "collection_id": 40
            });
            const slug = slugg(result.name);
            const dashboardSlug = slug ? `${result.id}-${slug}` : result.id;
            this.props.push({
                pathname: this.props.location.pathname,
                query: { dashboardSlug: dashboardSlug }
            });
        }

    }
    changeDashboardName = (value) => {
        this.setState({
            dashboardName: value
        })
    }
    handleEditDashboardName = () => {
        this.setState({ ifEditDashboardName: true }, () => {
            this.dashboardNameInputRef.current.focus();
        });
    }
    finishEditDashboardName = () => {
        this.setState({
            ifEditDashboardName: false
        })
    }
    handleEditTag = () => {
        this.setState({ ifEditTag: true, addTagName: '' }, () => {
            this.tagInputRef.current.focus();
        });
    }
    changeTagName = (value) => {
        this.setState({
            addTagName: value
        })
    }
    finishEditTag = () => {
        this.setState({
            tagList: [...this.state.tagList, this.state.addTagName],
            ifEditTag: false
        })
    }
    removeTag = (i) => {
        const tagList = [...this.state.tagList];
        tagList.splice(i, 1);
        this.setState({
            tagList,
        })
    }
    handleCancel=()=>{
        
    }
    handleAddChart = () => {
        this.AddChartModalRef.init();
        // const url = Urls.newQuestion({
        //     mode: "notebook",
        //     creationType: "custom_question",
        // })
        // console.log('111', url);
        // this.props.push(url);
    }

  onAddTextBox = () => {
    const {dispatch, getState} = this.DashbaordAppRef.store;
    addTextDashCardToDashboard({dashId: getState().dashboard.dashboardId })(dispatch, getState);
  }

  onAddImageBox = () => {
    const {dispatch, getState} = this.DashbaordAppRef.store;
    addImageDashCardToDashboard({dashId: getState().dashboard.dashboardId })(dispatch, getState);
  }

  onAddVideoBox = () => {
    const {dispatch, getState} = this.DashbaordAppRef.store;
    addVideoDashCardToDashboard({dashId: getState().dashboard.dashboardId })(dispatch, getState);
  }
    render() {
        const { tagList, dashboardName, ifEditDashboardName, ifEditTag } = this.state;
        return (
            <div className="web3go-dashboard-create-page">
                <div className="p-top">
                    <div className="pt-left">
                        <div className="ptl-icon">
                            <img src={require("@/web3goLayout/assets/dashboardCreate/Dashboard-line2.png")} alt="" />
                        </div>
                        <div className="ptl-right">
                            <div className={cx("title", { edit: ifEditDashboardName })}>
                                <Input ref={this.dashboardNameInputRef} className="input" type="text" value={dashboardName} onChange={this.changeDashboardName} onBlur={this.finishEditDashboardName} onPressEnter={this.finishEditDashboardName} />
                                <span className="text">{dashboardName}</span>
                                {ifEditDashboardName ?
                                    null :
                                    <img onClick={this.handleEditDashboardName} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/edit.png")} alt="" />
                                }
                            </div>
                            <div className="tag-list">
                                {tagList.map((v, i) => (<div className="item" key={i}>
                                    <span>{v}</span>
                                    <img onClick={() => { this.removeTag(i) }} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/close.png")} alt="" />
                                </div>))}
                                {
                                    ifEditTag ? (
                                        <div className="add-tag hover-item">
                                            <Input ref={this.tagInputRef} className="input" type="text" onChange={this.changeTagName} onBlur={this.finishEditTag} onPressEnter={this.finishEditTag} />
                                        </div>
                                    ) : (
                                        <div className="add-tag hover-item" onClick={this.handleEditTag}>
                                            <img src={require("@/web3goLayout/assets/dashboardCreate/add.png")} alt="" />
                                            <span>Add tag</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="pt-right">
                        <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                        <Button className="btn">Save as Draft</Button>
                        <Button className="btn" type="primary" >Post</Button>
                    </div>
                </div>
                <div className="p-operation-wrap">
                    <div className="item hover-item" onClick={this.handleAddChart}>
                        <img src={require("@/web3goLayout/assets/dashboardCreate/chart.png")} alt="" />
                        <span>Add Chart</span>
                    </div>
                    <div className="item hover-item">
                        <img src={require("@/web3goLayout/assets/dashboardCreate/filter.png")} alt="" />
                        <span>Add Filter</span>
                    </div>
                    <div className="item hover-item" onClick={this.onAddTextBox}>
                        <img src={require("@/web3goLayout/assets/dashboardCreate/text.png")} alt="" />
                        <span>Add Text</span>
                    </div>
                    <div className="item hover-item" onClick={this.onAddVideoBox}>
                        <img src={require("@/web3goLayout/assets/dashboardCreate/media.png")} alt="" />
                        <span>Add Video</span>
                    </div>
                    <div className="item hover-item" onClick={this.onAddImageBox}>
                        <img src={require("@/web3goLayout/assets/dashboardCreate/image.png")} alt="" />
                        <span>Add Image</span>
                    </div>
                </div>
                <div className="p-main">
                    {this.props.location.query.dashboardSlug ?
                      <DashboardApp {...this.props} ref={(ref) => this.DashbaordAppRef = ref} /> 
                    : null}
                </div>
                <AddChartModal {...this.props} onRef={(ref) => this.AddChartModalRef = ref}></AddChartModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
