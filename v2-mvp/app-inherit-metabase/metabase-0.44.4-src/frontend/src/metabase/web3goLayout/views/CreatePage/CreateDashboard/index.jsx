/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Spin, Upload, Message, AutoComplete, Tabs, Typography, Tooltip } from '@arco-design/web-react';
import { IconLaunch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { replace } from "react-router-redux";
import cx from "classnames";
import AddChartModal from './AddChartModal';
import AddFilterDrawer from './AddFilterDrawer';
import * as Urls from "metabase/lib/urls";
import { DashboardApi } from '@/services';
import slugg from "slugg";
import DashboardApp from "metabase/dashboard/containers/DashboardApp";
import * as dashboardActions from "@/dashboard/actions";
import { publicSpaceCollectionId } from "metabase/redux/app";
import domtoimage from 'dom-to-image';
import event from '@/web3goLayout/event';
import { LayoutDashboardApi } from "../../../../services";

//import { addTextDashCardToDashboard, addImageDashCardToDashboard, addVideoDashCardToDashboard } from "../../../../dashboard/actions";
import {
    getDashboardComplete,
} from "@/dashboard/selectors";
const mapStateToProps = (state, props) => {
    return {
        key: props.location.params,
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        publicSpaceCollectionId: state.app.publicSpaceCollectionId,
        dashboard: getDashboardComplete(state, props)
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
            tagList: [],
            savedCurrentTagList: [],
            ifEditTag: false,
            addTagName: '',
            allTagList: [],
            savedAllTagList: [],
            currentDashboardId: null,
            addFilterDrawerVisible: false,
            addFilterDrawerIsEdit: false,
            saveBtnLoading: false,
            postBtnLoading: false,
            isEditing: true
        }
        this.dashboardNameInputRef = React.createRef();
        this.tagInputRef = React.createRef();
        this.AddChartModalRef = React.createRef();
    }
    async componentDidMount() {
        this.init();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.params !== this.props.params) {
            this.init();
        }
        if ((prevProps.dashboard !== this.props.dashboard) && this.props.dashboard && this.props.dashboard.name) {
            this.setState({
                dashboardName: this.props.dashboard.name
            })
        }
    }
    changeAddFilterDrawerVisible = (value) => {
        this.setState({
            addFilterDrawerVisible: value
        });
    }
    changeAddFilterDrawerIsEdit = (value) => {
        this.setState({
            addFilterDrawerIsEdit: value
        });
    }
    init = async () => {
        // if (!this.props.params.dashboardSlug) {
        //     this.setState({
        //         createDefaultDbLoading: true
        //     });
        //     const result = await DashboardApi.create({
        //         "name": this.state.dashboardName,
        //         "collection_id": this.props.publicSpaceCollectionId
        //     });
        //     const slug = slugg(result.name);
        //     const dashboardSlug = slug ? `${result.id}-${slug}` : result.id;
        //     this.setState({
        //         createDefaultDbLoading: false
        //     });
        //     this.props.replace({
        //         pathname: this.props.location.pathname + '/' + dashboardSlug,
        //     });
        //     return;
        // }
        // if (!this.props.params.dashboardSlug) {
        //     this.props.setDashboardAttributes({ id: this.props.dashboard.id, attributes: { parameters: {createPending: true} } });
        // }
        const slug = this.props.params.dashboardSlug;
        const currentDashboardId = Urls.extractEntityId(slug) || -1;
        this.setState({
            currentDashboardId
        });
        if (this.props.params.dashboardSlug) {
            this.getDashboardTags(currentDashboardId);
        }
        this.getAllTagList();
    }
    getDashboardTags = (currentDashboardId) => {
        LayoutDashboardApi.listDashboardTags(currentDashboardId)().then(d => {
            this.setState({
                tagList: d.map(v => v.tag_name),
                savedCurrentTagList: d
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
        this.props.router.goBack();
    }
    saveTag = (newDashbarodId) => {
        const { tagList, savedAllTagList, savedCurrentTagList } = this.state;
        let currentDashboardId = newDashbarodId || this.state.currentDashboardId;
        const removeTagList = [];
        const markTagList = [];
        tagList.forEach(v => {
            if (!savedCurrentTagList.find(sv => sv.tag_name == v)) {
                const find = savedAllTagList.find(sv => sv.tagName == v)
                if (find) {
                    markTagList.push(find);

                } else {
                    LayoutDashboardApi.AddTag({
                        "dashboardId": currentDashboardId,
                        "tagName": v
                    })
                }
            }
        });
        savedCurrentTagList.forEach(v => {
            if (!tagList.includes(v.tag_name)) {
                removeTagList.push(v);
            }
        })
        if (markTagList.length) {
            LayoutDashboardApi.markTags({
                "dashboardId": currentDashboardId,
                "tagIds": markTagList.map(v => v.id)
            })
        }
        if (removeTagList.length) {
            LayoutDashboardApi.removeTags({
                "dashboardId": currentDashboardId,
                "tagIds": removeTagList.map(v => v.id)
            })
        }
    }
    handleAddChart = () => {
        this.AddChartModalRef.init();
    }
    handleAddFilter = () => {
        this.changeAddFilterDrawerIsEdit(false);
        this.changeAddFilterDrawerVisible(true);
    }
    onAddTextBox = () => {
        const { dispatch, getState } = this.DashbaordAppRef.store;
        //addTextDashCardToDashboard({ dashId: getState().dashboard.dashboardId })(dispatch, getState);
        this.DashbaordAppRef.props.openNewCardEditorSidebar({ type: 'text', dashId: getState().dashboard.dashboardId });
    }

    onAddImageBox = () => {
        const { dispatch, getState } = this.DashbaordAppRef.store;
        // addImageDashCardToDashboard({ dashId: getState().dashboard.dashboardId })(dispatch, getState);
        this.DashbaordAppRef.props.openNewCardEditorSidebar({ type: 'image', dashId: getState().dashboard.dashboardId });
    }

    onAddVideoBox = () => {
        const { dispatch, getState } = this.DashbaordAppRef.store;
        //addVideoDashCardToDashboard({ dashId: getState().dashboard.dashboardId })(dispatch, getState);
        this.DashbaordAppRef.props.openNewCardEditorSidebar({ type: 'video', dashId: getState().dashboard.dashboardId });

    }

    addChartToDashboard = (cardId) => {
        this.props.addCardToDashboard({ dashId: this.state.currentDashboardId, cardId });
    }
    uploadThumbnail = (id) => {
        return new Promise((resolve) => {
            this.setState({
                isEditing: false
            }, () => {
                const el = document.getElementById('dashboard-thumbnail');
                domtoimage.toBlob(el, {
                    quality: 0.2,
                    width: 1200,
                    height: 630,
                    bgcolor: 'rgb(250,251,252)',
                })
                    .then((blob) => {
                        this.setState({
                            isEditing: true
                        });
                        // const uuid = crypto.randomUUID();
                        const formData = new FormData();
                        formData.append('file', blob);
                        LayoutDashboardApi.previewUrl(id)(formData, { isUpload: true }).then(d => {
                            resolve();
                        });
                        // var link = document.createElement('a');
                        // link.download = 'AAA.png';
                        // link.href = dataUrl;
                        // link.click();
                    });
            });
        });
    }
    handlePostDashboard = async (isDraft) => {
        if (this.state.saveBtnLoading || this.state.postBtnLoading) {
            return;
        }
        const loadingKey = isDraft ? 'saveBtnLoading' : 'postBtnLoading';
        // 改了名字，得先触发blur事件再保存
        setTimeout(async () => {
            if (!isDraft) {
                if (!this.DashbaordAppRef.props.dashboard.ordered_cards || !this.DashbaordAppRef.props.dashboard.ordered_cards.length) {
                    Message.error('Please add something to dashboard');
                    return;
                }
            }

            const isDelayDashboardCreation = !this.props.params.dashboardSlug
            let realId = this.props.dashboard.id;
            if (isDelayDashboardCreation) {
                const result = await DashboardApi.create({
                    "name": this.state.dashboardName,
                    "collection_id": this.props.publicSpaceCollectionId
                });
                realId = result.id;
                this.props.setIdForNewDashboard({ id: this.props.dashboard.id, newId: realId, dashboardName: this.state.dashboardName });//(dispatch, getState);
                this.setState({ dashboardId: realId })
            }

            this.setState({
                [loadingKey]: true
            });
            event.emit('saveDashboard', this.state.dashboardName, async () => {
                this.saveTag();
                if (!isDraft) {
                    await this.props.createPublicLink({ id: realId });
                    await LayoutDashboardApi.externalEvent({
                        "topic": "dashboard.changed",
                        "data": realId
                    })
                    await this.uploadThumbnail(realId);
                }
                this.setState({
                    [loadingKey]: false
                });
                 if (!isDraft) {
                    this.props.push('/');
                 } else if (isDelayDashboardCreation) { 
                    const slug = slugg(this.state.dashboardName);
                    const dashboardSlug = `${realId}-${slug}`;
                    this.props.replace({
                        pathname: this.props.location.pathname + '/' + dashboardSlug
                    });
                }
            }, realId);
        }, 0);
    }
    // handleSaveDashboard = () => {
    //     // 改了名字，得先触发blur事件再保存
    //     setTimeout(() => {
    //         this.setState({
    //             saveBtnLoading: true
    //         });
    //         event.emit('saveDashboard', this.state.dashboardName, () => {
    //             this.saveTag();
    //             this.setState({
    //                 saveBtnLoading: false
    //             });
    //             this.props.push('/');
    //         });
    //     }, 0);
    // }
    // handleSaveDashboard = () => {
    //     this.setState({
    //         saveBtnLoading: true
    //     });
    //     event.emit('saveDashboard', this.state.dashboardName, () => {
    //         this.saveTag();
    //         this.setState({
    //             saveBtnLoading: false
    //         });
    //         this.props.push('/');
    //     });
    // }

    render() {
        console.log('111', this.props.dashboard);
        const { tagList, dashboardName, ifEditDashboardName, ifEditTag, createDefaultDbLoading, allTagList, addFilterDrawerVisible, addFilterDrawerIsEdit, isEditing } = this.state;
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
                    {
                        !this.props.dashboard || this.props.dashboard.id == -1 || !this.props.dashboard.public_uuid ? (
                            <div className="pt-right">
                                <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                                <Button className="btn" loading={this.state.saveBtnLoading} onClick={() => this.handlePostDashboard(true)}>Save as Draft</Button>
                                <Button className="btn" loading={this.state.postBtnLoading} onClick={() => this.handlePostDashboard(false)} type="primary">Post</Button>
                            </div>
                        ) : (
                            <div className="pt-right">
                                <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                                <Button className="btn" loading={this.state.postBtnLoading} onClick={() => this.handlePostDashboard(false)} type="primary">Save</Button>
                            </div>
                        )
                    }
                </div>
                <div className="p-operation-wrap">
                    <div className="item hover-item" onClick={this.handleAddChart}>
                        <img src={require("@/web3goLayout/assets/dashboardCreate/chart.png")} alt="" />
                        <span>Add Chart</span>
                    </div>
                    <div className="item hover-item" onClick={this.handleAddFilter}>
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
                    <DashboardApp isEditing={isEditing} {...this.props} ref={(ref) => this.DashbaordAppRef = ref} />
                </div>
                <AddChartModal {...this.props} onRef={(ref) => this.AddChartModalRef = ref} addChartToDashboard={this.addChartToDashboard}></AddChartModal>
                <AddFilterDrawer {...this.props}
                    addFilterDrawerVisible={addFilterDrawerVisible}
                    changeAddFilterDrawerVisible={this.changeAddFilterDrawerVisible}
                    addFilterDrawerIsEdit={addFilterDrawerIsEdit}
                    changeAddFilterDrawerIsEdit={this.changeAddFilterDrawerIsEdit}
                ></AddFilterDrawer>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
