/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Spin, Upload, Message, AutoComplete, Tabs, Typography, Tooltip } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { replace } from "react-router-redux";
import cx from "classnames";
import AddChartModal from './AddChartModal';
import * as Urls from "metabase/lib/urls";
import { DashboardApi } from '@/services';
import slugg from "slugg";
import DashboardApp from "metabase/dashboard/containers/DashboardApp";
import * as dashboardActions from "@/dashboard/actions";
import { publicSpaceCollectionId } from "metabase/redux/app";
import event from '@/web3goLayout/event';
import { LayoutDashboardApi } from "../../../../services";


import { addTextDashCardToDashboard, addImageDashCardToDashboard, addVideoDashCardToDashboard } from "../../../../dashboard/actions";

const { Text } = Typography;
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        publicSpaceCollectionId: state.app.publicSpaceCollectionId,
    }
};
const mapDispatchToProps = {
    ...dashboardActions,
    replace,

};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            createDefaultDbLoading: false,
            ifEditDashboardName: false,
            dashboardName: 'New dashboard',
            tagList: ['aaa'],
            ifEditTag: false,
            addTagName: '',
            allTagList: [],
            savedAllTagList: [],
            currentDashboardId: null
        }
        this.dashboardNameInputRef = React.createRef();
        this.tagInputRef = React.createRef();
        this.AddChartModalRef = React.createRef();
    }
    async componentDidMount() {
        if (!this.props.params.dashboardSlug) {
            this.setState({
                createDefaultDbLoading: true
            });
            const result = await DashboardApi.create({
                "name": this.state.dashboardName,
                "collection_id": this.props.publicSpaceCollectionId
            });
            const slug = slugg(result.name);
            const dashboardSlug = slug ? `${result.id}-${slug}` : result.id;
            this.setState({
                createDefaultDbLoading: false
            });
            this.props.replace({
                pathname: this.props.location.pathname + '/' + dashboardSlug,
            });
            return;
        }
        const slug = this.props.params.dashboardSlug;
        const currentDashboardId = Urls.extractEntityId(slug);
        this.setState({
            currentDashboardId
        });
        this.getDashboardTags(currentDashboardId);
        this.getAllTagList();
    }
    getDashboardTags = (currentDashboardId) => {
        LayoutDashboardApi.listDashboardTags(currentDashboardId)().then(d => {
            this.setState({
                tagList: d.map(v => v.tag_name)
            });
        })
    }
    getAllTagList = () => {
        LayoutDashboardApi.listAllTags().then(d => {
            this.setState({
                savedAllTagList: d,
                allTagList: d.map(v => v.tagName)
            });
        });
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
        if (!this.state.addTagName) {
            this.setState({
                ifEditTag: false
            })
            return;
        }
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
    handleCancel = () => {
        LayoutDashboardApi.AddTag({
            "dashboardId": 271,
            "tagName": "hhh"
        });
    }
    handleAddChart = () => {
        this.AddChartModalRef.init();
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
    addChartToDashboard = (cardId) => {
        this.props.addCardToDashboard({ dashId: this.state.currentDashboardId, cardId });
    }
    handleSaveDashboard = () => {
        event.emit('saveDashboard', this.state.dashboardName, () => {
            this.props.push('/');
        });
    }
    render() {
        const { tagList, dashboardName, ifEditDashboardName, ifEditTag, createDefaultDbLoading, allTagList } = this.state;
        if (createDefaultDbLoading) {
            return <Spin style={
                {
                    display: 'block', minHeight: 100, display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }></Spin >
        }
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
                                            <AutoComplete ref={this.tagInputRef} data={allTagList} className="input" type="text" onChange={this.changeTagName} onBlur={this.finishEditTag} onPressEnter={this.finishEditTag} ></AutoComplete>
                                            {/* <Input ref={this.tagInputRef} className="input" type="text" onChange={this.changeTagName} onBlur={this.finishEditTag} onPressEnter={this.finishEditTag} /> */}
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
                        <Button className="btn" onClick={this.handleSaveDashboard}>Save as Draft</Button>
                        <Button className="btn" type="primary">Post</Button>
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
                    {this.props.params.dashboardSlug ?
                      <DashboardApp {...this.props} ref={(ref) => this.DashbaordAppRef = ref} /> 
                    : null}
                </div>
                <AddChartModal {...this.props} onRef={(ref) => this.AddChartModalRef = ref} addChartToDashboard={this.addChartToDashboard}></AddChartModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
