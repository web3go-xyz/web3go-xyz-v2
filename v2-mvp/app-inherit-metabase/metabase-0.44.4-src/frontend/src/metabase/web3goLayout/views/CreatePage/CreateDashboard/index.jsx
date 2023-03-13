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
import { toggleDark, changeMyDashboardList } from "metabase/redux/app";
import DashboardApp from "metabase/dashboard/containers/DashboardApp";
import * as dashboardActions from "@/dashboard/actions";
import domtoimage from 'dom-to-image';
import event from '@/web3goLayout/event';
import { LayoutDashboardApi, CardApi } from "../../../../services";
import SelectDashboardToEditModal from './SelectDashboardToEditModal';

import { addTextDashCardToDashboard, addImageDashCardToDashboard, addVideoDashCardToDashboard } from "../../../../dashboard/actions";
import {
    getDashboardComplete,
} from "@/dashboard/selectors";
import { NewCardEditorSidebar } from "../../../../dashboard/components/new-card-editor-sidebar/NewCardEditorSidebar";
import LinkedDatasetsModal from './LinkedDatasetsModal';
import { publicSpaceCollectionId, changePublicSpaceCollectionId } from "metabase/redux/app";


const mapStateToProps = (state, props) => {
    return {
        key: props.location.params,
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        publicSpaceCollectionId: state.app.publicSpaceCollectionId,
        dashboard: getDashboardComplete(state, props),
    }
};
const mapDispatchToProps = {
    ...dashboardActions,
    replace,
    changePublicSpaceCollectionId,
    changeMyDashboardList
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            isEditing: true,
            originDashboardDetail: {},
            datasetList: [],
            getUsedDatasetListLoading: false,
            refreshThisComponentFlag: true,
            alreadyInitEditData: false,
        }
        this.dashboardNameInputRef = React.createRef();
        this.tagInputRef = React.createRef();
        this.AddChartModalRef = React.createRef();
        this.NewCardEditorRef = React.createRef();
        this.LinkedDatasetsModalRef = React.createRef();
        this.SelectDashboardToEditModalRef = React.createRef();

    }
    async componentDidMount() {
        //测试用，加快速度
        this.props.changePublicSpaceCollectionId(40);
        // const collectionList = await CollectionsApi.list();
        // const publicSpaceCollection = collectionList.find(v => v.name == 'PublicSpace');
        // this.props.changePublicSpaceCollectionId(publicSpaceCollection.id);

        event.on('editChartEvent', this.handleEditChart);
        this.init();
        // setTimeout(() => {
        //     this.onAddImageBox({preload: true});
        // }, 1000)
        // addChart后没关闭弹窗直接刷新，导致参数残留
        if (!location.pathname.includes('/chart') && (this.props.params.chartSlug || this.props.location.hash)) {
            this.props.replace({
                pathname: '/layout/create/dashboard',
            });
            return;
        }
        if (this.props.location.state && this.props.location.state.selectDashboardToEdit) {
            this.getMyDashboards(() => {
                this.SelectDashboardToEditModalRef.init();
            });
            this.props.replace({
                pathname: '/layout/create/dashboard',
            });
            return;
        }
    }
    componentWillUnmount() {
        event.off('editChartEvent', this.handleEditChart)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.params !== this.props.params) {
            this.init();
        }
        if ((prevProps.dashboard !== this.props.dashboard) && this.props.dashboard && this.props.dashboard.name) {
            if (!this.state.alreadyInitEditData) {
                this.setState({
                    dashboardName: this.props.dashboard.name,
                    alreadyInitEditData: true
                })
            }
        }
        if (!prevProps.dashboard && this.props.dashboard) {
            this.setState({
                originDashboardDetail: this.props.dashboard
            });
        }
    }
    getMyDashboards = (cb) => {
        if (!this.props.userData.account) {
            this.props.changeMyDashboardList([]);
            return;
        }
        LayoutDashboardApi.list({
            "pageSize": 999999999999,
            "pageIndex": 1,
            "orderBys": [],
            "tagIds": [],
            "searchName": '',
            "creator": this.props.userData.account.accountId,
            "dashboardIds": []
        }).then(d => {
            this.props.changeMyDashboardList(d.list);
            if (cb) {
                cb();
            }
        });
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
        this.props.replace('/layout/mySpace');
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
    handleEditChart = (chartObj) => {
        this.AddChartModalRef.init(chartObj);
    }
    handleAddFilter = () => {
        this.changeAddFilterDrawerIsEdit(false);
        this.changeAddFilterDrawerVisible(true);
    }
    onAddTextBox = () => {
        const { dispatch, getState } = this.DashbaordAppRef.store;
        //addTextDashCardToDashboard({ dashId: getState().dashboard.dashboardId })(dispatch, getState);
        //this.props.openNewCardEditorSidebar({ type: 'text', dashId: getState().dashboard.dashboardId });
        const dashboardId = getState().dashboard.dashboardId;
        this.NewCardEditorRef.doShow({
            dashboardId,
            params: { type: 'text', action: 'add', dashboardId, }
        });
    }

    onAddImageBox = ({ preload }) => {
        const { dispatch, getState } = this.DashbaordAppRef.store;
        // this.props.openNewCardEditorSidebar({ type: 'image', dashId: getState().dashboard.dashboardId, preload });
        const dashboardId = getState().dashboard.dashboardId;
        this.NewCardEditorRef.doShow({
            dashboardId,
            params: { type: 'image', action: 'add', dashboardId, }
        });
    }

    onAddVideoBox = () => {
        const { dispatch, getState } = this.DashbaordAppRef.store;
        //addVideoDashCardToDashboard({ dashId: getState().dashboard.dashboardId })(dispatch, getState);
        // this.props.openNewCardEditorSidebar({ type: 'video', dashId: getState().dashboard.dashboardId });
        const dashboardId = getState().dashboard.dashboardId;
        this.NewCardEditorRef.doShow({
            dashboardId,
            params: { type: 'video', action: 'add', dashboardId, }
        });
    }

    addChartToDashboard = async (cardId) => {
        await this.props.addCardToDashboard({ dashId: this.state.currentDashboardId, cardId });
    }
    removeAndAddChatToDashboard = async (cardId, originCard) => {
        await this.props.removeCardFromDashboard({
            dashId: this.state.currentDashboardId,
            dashcardId: originCard.dashcardId,
        });
        await this.props.addToDashboardWithOldPosition({ dashId: this.state.currentDashboardId, cardId, originCard })
    }
    uploadThumbnail = async (id, thumbnailBlob) => {
        const formData = new FormData();
        formData.append('file', thumbnailBlob);
        await LayoutDashboardApi.previewUrl(id)(formData, { isUpload: true })
    }
    createThumbnail() {
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
                        resolve(blob);
                    }).catch(e => {
                        resolve(undefined)
                    })
            });
        });
    }
    clickLinkedDatasets = () => {
        this.LinkedDatasetsModalRef.init();
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
            this.setState({
                [loadingKey]: true
            });
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

            let thumbnailBlob;
            if (!isDraft) {
                thumbnailBlob = await this.createThumbnail();
            }
            event.emit('saveDashboard', this.state.dashboardName, async () => {
                this.saveTag(realId);
                if (!isDraft) {
                    await this.props.createPublicLink({ id: realId });
                    await LayoutDashboardApi.externalEvent({
                        "topic": "dashboard.changed",
                        "data": realId
                    })
                    if (thumbnailBlob) {
                        await this.uploadThumbnail(realId, thumbnailBlob);
                    }
                }
                this.setState({
                    [loadingKey]: false
                });
                if (!isDraft) {
                    this.props.replace('/');
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
    getDatasetList = async () => {
        this.setState({
            getUsedDatasetListLoading: true
        });
        let promiseArr = [];
        this.usedDatasetList.forEach(v => {
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
            datasetList: resultArr.filter(v => !v.archived),
            getUsedDatasetListLoading: false
        });
    }
    get usedDatasetList() {
        const { dashboard } = this.props;
        const map = {};
        if (!dashboard || !dashboard.ordered_cards) {
            return [];
        }
        dashboard.ordered_cards.forEach((v) => {
            if (v.card && v.card.dataset_query && v.card.dataset_query.query && v.card.dataset_query.query['source-table']) {
                map[v.card.dataset_query.query['source-table']] = v.card.dataset_query.query['source-table']
            }
        });
        return Object.keys(map).map(key => map[key])
    }
    render() {
        const { tagList, dashboardName, ifEditDashboardName, ifEditTag, allTagList, addFilterDrawerVisible, addFilterDrawerIsEdit, isEditing, originDashboardDetail } = this.state;

        if (!this.props.publicSpaceCollectionId) {
            return <Spin style={
                {
                    display: 'block', minHeight: 100, display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }></Spin>;
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
                            {
                                this.state.currentDashboardId >= 0 && !this.state.getUsedDatasetListLoading && this.state.datasetList.length > 0 ? (
                                    <div className="linked-datasets">
                                        <div onClick={this.clickLinkedDatasets} className="inner hover-primary">
                                            <span>
                                                Linked Datasets:
                                            </span>
                                            <span className="number">
                                                {this.state.datasetList.length}
                                            </span>
                                        </div>
                                    </div>
                                ) : null
                            }

                        </div>
                    </div>
                    {
                        originDashboardDetail.id == -1 || !originDashboardDetail.public_uuid ? (
                            <div className="pt-right">
                                <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                                <Button className="btn" loading={this.state.saveBtnLoading} onClick={() => this.handlePostDashboard(true)}>Save Draft</Button>
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
                <AddChartModal {...this.props} onRef={(ref) => this.AddChartModalRef = ref} addChartToDashboard={this.addChartToDashboard} removeAndAddChatToDashboard={this.removeAndAddChatToDashboard}></AddChartModal>
                <AddFilterDrawer {...this.props}
                    addFilterDrawerVisible={addFilterDrawerVisible}
                    changeAddFilterDrawerVisible={this.changeAddFilterDrawerVisible}
                    addFilterDrawerIsEdit={addFilterDrawerIsEdit}
                    changeAddFilterDrawerIsEdit={this.changeAddFilterDrawerIsEdit}
                ></AddFilterDrawer>
                <NewCardEditorSidebar {...this.props} ref={(ref) => this.NewCardEditorRef = ref}
                    addFilterDrawerVisible={addFilterDrawerVisible}
                    changeAddFilterDrawerVisible={this.changeAddFilterDrawerVisible}
                    addFilterDrawerIsEdit={addFilterDrawerIsEdit}
                    changeAddFilterDrawerIsEdit={this.changeAddFilterDrawerIsEdit}
                ></NewCardEditorSidebar>
                <LinkedDatasetsModal {...this.props} usedDatasetList={this.usedDatasetList} datasetList={this.state.datasetList} getDatasetList={this.getDatasetList} getUsedDatasetListLoading={this.state.getUsedDatasetListLoading} onRef={(ref) => this.LinkedDatasetsModalRef = ref} ></LinkedDatasetsModal>
                <SelectDashboardToEditModal {...this.props} onRef={(ref) => this.SelectDashboardToEditModalRef = ref} ></SelectDashboardToEditModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
